const AssetHandler = () => {
	
	const getImage = (imageUrl) => {
		return new Promise((resolve, reject) => {
			let img = new Image();
			img.onload = () => resolve(img);
			img.onerror = reject;
			img.src = imageUrl;
		 })
	}
	
	const loadImage = async(imageUrl) => await getImage(imageUrl);
	
	const renderPlaformToImage = (multiplier) => {
		const r = 63;
		const g = 255;
		const b = 255;
		const strokeColour = 'rgba(63,255,255,0.2)';
		const fillColour =  'rgba(200,8,191,0.3)';
		const lineWidth = 2;
		const position  = { x:10, y:10 };
		
		const drawNeonPlatform = (newCtx) => {
			newCtx.save();
			newCtx.shadowColor = "rgb("+r+","+g+","+b+")";
			newCtx.shadowBlur = 10;
			newCtx.strokeStyle= "rgba("+r+","+g+","+b+",0.2)";
			newCtx.lineWidth=7.5;
			drawPlatform(newCtx);
			newCtx.strokeStyle= "rgba("+r+","+g+","+b+",0.2)";
			newCtx.lineWidth=6;
			drawPlatform(newCtx);
			newCtx.strokeStyle= "rgba("+r+","+g+","+b+",0.2)";
			newCtx.lineWidth=4.5;
			drawPlatform(newCtx);
			newCtx.strokeStyle= "rgba("+r+","+g+","+b+",0.2)";
			newCtx.lineWidth=3;
			drawPlatform(newCtx);
			newCtx.strokeStyle= '#fff';
			newCtx.lineWidth=1.5;
			drawPlatform(newCtx);
			newCtx.restore(newCtx);
		}
		
		const drawPlatform = (newCtx) => {
			newCtx.beginPath();
			newCtx.moveTo(position.x , position.y );
			let corners = [];
			let newX = position.x + (brickSize.width * multiplier);
			let newY = position.y;
			newCtx.lineTo(newX, newY);
			corners.push({x:newX, y:newY});
			newY = position.y + brickSize.height;
			newX = newX -= (brickSize.height/2);
			newCtx.lineTo(newX, newY);
			corners.push({x:newX, y:newY});
			newX -= (brickSize.width * multiplier) - brickSize.height;
			newCtx.lineTo(newX, newY);
			corners.push({x:newX, y:newY});
			newX -= (brickSize.height/2);
			newY -= brickSize.height;
			newCtx.lineTo(newX, newY);
			corners.push({x:newX, y:newY});
			newCtx.lineWidth = lineWidth;
			newCtx.stroke();
		}
		
		const getImage = () => {
			let newCanvas = document.createElement('canvas');
			newCanvas.width =  (brickSize.width* multiplier) + 20;
			newCanvas.height = brickSize.height + 20;
			const newCtx = newCanvas.getContext('2d');
			//fill the canvas with full transparency
			newCtx.fillStyle = 'rgba(0,0,0,0.0)';
			newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);
			drawNeonPlatform(newCtx);
			let newImage = document.createElement('img');
			//create a png with full tansparency
			newImage.src = canvasToImage(newCanvas,newCtx,'rgba(0,0,0,0.0)');
			newCanvas = null;
			return newImage;
		}
		
		return {getImage};
	}
	
	const init = async () => {
		console.log('init');
		const maxNoOfPlatforms = Math.floor((canvas.width - brickSize.width) / brickSize.width);
		for (let i = 0; i < maxNoOfPlatforms; i++ )
				platformImg.push(renderPlaformToImage(i+1).getImage());
	}
	return { init }
}

const assetHandler = AssetHandler();

const GameDirector = () => {
	assetHandler.init();
	const scoreboard = Scoreboard();
	const spawnInterval = 40000;
	let timeElaspedSinceLastSpawn = 0;
	let platforms = [];
	let coins = []
	let spawnedAt = 0;
	
	const resetGame = () => {
		scoreboard.reset();
		platforms = [];
		coins = [];
	}
	
	const getRandomInt = (min, max) =>{
		min = Math.ceil(min);
		max = Math.floor(max);
		return Math.floor(Math.random() * (max - min + 1)) + min;
	}
	
	const spawnPlatforms = () => {
		const maxNoOfPlatforms = Math.floor((canvas.width - brickSize.width) / brickSize.width);
		//Less number of platforms the harder the game
		const noOfPlatforms = getRandomInt(1,maxNoOfPlatforms);
		const maxWidth = Math.floor(maxNoOfPlatforms / noOfPlatforms);
		let offSetStart = getRandomInt(0,1);
		let platformSize = getRandomInt(1,maxWidth);
		//get the plaform widths to use
		let randomPlatformWidths = [];
		
		for (let i = 0; i < noOfPlatforms; i++){
			platformSize = getRandomInt(1,maxWidth);
			randomPlatformWidths.push( platformSize );
		}
		
		let sumOfPlatformWidths = randomPlatformWidths.reduce( (acc, val) => { 
			return acc + val; 
		} , 0);
		
		let emptySpaceDistribution = (canvas.width - (sumOfPlatformWidths * brickSize.width));// / noOfPlatforms;
		let x = (offSetStart == 1 ? emptySpaceDistribution : 0);
		
		for (platformWidth of randomPlatformWidths){
			platforms.push(Platform(x, canvas.height, platformWidth * brickSize.width));
			if (getRandomInt(0,10) == 5){
				coins.push(Collectable(x + ((platformWidth * brickSize.width)/2), canvas.height - 10));
			}
			x += (platformWidth * brickSize.width) + emptySpaceDistribution;
		}
	
		spawnAt = Date.now();
	}
	
	const drawPlatforms = () => {
		for (platform of platforms)
			platform.draw();
		for (coin of coins)
			coin.draw();
	}
	
	const collidedWithPlatform = (thePlayer) => {
		for (platform of platforms){
			if (platform.inBounds(thePlayer.getPosition().x, thePlayer.getPosition().y)){
				thePlayer.getPosition().y = platform.getPosition().y;
				return true;
			}
		}
	}
	
	const collidedWithCoin  = (thePlayer) => {
		let deleted = false;
		
		for (let i = coins.length-1; i > -1 ; i--){
			if (coins[i].intersects(thePlayer.getBounds())){
				scoreboard.increaseScore(100000);
				delete coins[i];
				deleted = true;
			}
		}
		
		if (deleted){
			let temp = [];	
			for(let i of coins){
				i && temp.push(i); // copy each non-empty value to the 'temp' array
				coins = temp;
			}
		}
	}
	
	const movePlatforms = () => {
		let deleted = false;
		
		for (let i = platforms.length-1; i > -1 ; i--){
			platforms[i].move();
			if (platforms[i].getPosition().y == 0){
				delete platforms[i];
				deleted = true;
			}	
		}
		
		if (deleted){
			let temp = [];	
			for(let i of platforms){
				i && temp.push(i); // copy each non-empty value to the 'temp' array
				platforms = temp;
			}
		}
		
		deleted = false;
		
		for (let i = coins.length-1; i > -1 ; i--){
			coins[i].move();
			if (coins[i].getPosition().y == 0){
				delete coins[i];
				deleted = true;
			}	
		}
		
		if (deleted){
			let temp = [];	
			for(let i of coins){
				i && temp.push(i); // copy each non-empty value to the 'temp' array
				coins = temp;
			}
		}
		
		timeElaspedSinceLastSpawn += (Date.now() - spawnAt);
		
		if (timeElaspedSinceLastSpawn > spawnInterval){
			spawnPlatforms();
			timeElaspedSinceLastSpawn = 0;
		}
	}
	return { resetGame, spawnPlatforms, drawPlatforms, collidedWithPlatform, movePlatforms, scoreboard, collidedWithCoin }
}