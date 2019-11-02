
let canvas = null;
let ctx = null;
let mainBackground = new Image();
let playerFrames = [];
	
	
const brickSize = {width: 64, height: 32};
let platformImg = [];
const canvasToImage = (theCanvas,context,backgroundColor) => {	
	var w = canvas.width;
	var h = canvas.height;
	var data;		
	if (backgroundColor) {
		//get the current ImageData for the canvas.
		data = context.getImageData(0, 0, w, h);
		
		//store the current globalCompositeOperation
		var compositeOperation = context.globalCompositeOperation;

		//set to draw behind current content
		context.globalCompositeOperation = "destination-over";

		//set background color
		context.fillStyle = backgroundColor;

		//draw background / rect on entire canvas
		context.fillRect(0,0,w,h);
	}

	//get the image data from the canvas
	var imageData = theCanvas.toDataURL("image/png");

	if(backgroundColor){
		//clear the canvas
		context.clearRect (0,0,w,h);

		//restore it with original / cached ImageData
		context.putImageData(data, 0,0);		

		//reset the globalCompositeOperation to what it was
		context.globalCompositeOperation = compositeOperation;
	}

	//return the Base64 encoded data url string
	return imageData;
}

const init = async () => {			
	canvas = document.getElementById('canvas');
	ctx = canvas.getContext('2d');
	let state = 'title';
	const player =  Player(220,100);
	const gameDirector = GameDirector();
	const backgroundHandler = BackgroundHandler();
	
	const getRandomArbitrary = (min, max) => Math.random() * (max - min) + min;

	const getImage = (imageUrl) => {
		return new Promise((resolve, reject) => {
			let img = new Image();
			img.onload = () => resolve(img);
			img.onerror = reject;
			img.src = imageUrl;
		 })
	}
	
	const loadImage = async(imageUrl) => await getImage(imageUrl);

	mainBackground = await loadImage("grafix/stars.jpg");
	playerFrames.push(await loadImage('animation/1.svg'));
	playerFrames.push(await loadImage('animation/2.svg'));
	playerFrames.push(await loadImage('animation/3.svg'));
	playerFrames.push(await loadImage('animation/4.svg'));

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
			
	const  drawTitle = () => neonLightEffect("Freefall 2019", "100px")
	
	const drawGameOver = () => neonLightEffect("Game Over", "100px");
	
	const neonLightEffect = (text, textSize) => {
		const blur = 10;
		ctx.save();
		ctx.font = "700 "+textSize+" Arial";
		ctx.textAlign = "center";
		ctx.shadowColor = '#FFF'
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = blur;
		ctx.lineWidth   = 2;
		ctx.strokeStyle = 'white';
		ctx.fillStyle = 'white';
		ctx.strokeText(text,  canvas.width/2, canvas.height/2);
		ctx.strokeStyle = 'rgba(255,255,255,0.2)';
		ctx.lineWidth   = 1;
		ctx.font = "700 "+textSize+" Arial";
		ctx.strokeText(text,  canvas.width/2 + 20, canvas.height/2 + 20);
		ctx.strokeStyle = 'rgba(255,255,255,0.2)';
		ctx.lineWidth   = 1;
		ctx.font = "700 "+textSize+" Arial";
		ctx.strokeText(text,  canvas.width/2 - 20, canvas.height/2 - 20);
		ctx.fillStyle = 'rgb(255,255,255)';
		ctx.font = "700 20px Arial";
		ctx.fillText('--- PRESS SPACE BAR TO CONTINUE ---',  canvas.width/2, canvas.height/2 + 50);
		ctx.restore();
	}

	const checkPlayerInBoundsOfScreen = () => {
		if (player.getPosition().y > canvas.height  || player.getPosition().y < 20){
			state = 'gameover';
			player.setPosition(canvas.width/2, 50);
			//add player reset for speed fall rate, above etc
			gameDirector.resetGame();
		}
	}

	const checkKeyBoard =(e) => {
		switch (state){
			case 'title':
				if (e.code == 'Space'){
					state = 'game';
					gameDirector.scoreboard.reset();
					gameDirector.spawnPlatforms();
				}
			break;
			case 'game':
				player.setState(e.keyCode);
			break;
			case 'gameover':
				if (e.code == 'Space'){
					state = 'title';
				}
			break;
		}  
	}

	const releaseKey = () =>  player.setState(null);
	const update = () => {
		backgroundHandler.update();
		switch (state){
			case 'game':
				gameDirector.scoreboard.update();
				player.move();
				player.animate();
				gameDirector.movePlatforms();
				player.drop(gameDirector.collidedWithPlatform(player));	
				gameDirector.collidedWithCoin(player);
				checkPlayerInBoundsOfScreen();
			break;
		}
	}
	
	const draw = () => {
		ctx.clearRect(0,0, canvas.width, canvas.height);
		backgroundHandler.draw();
		switch (state){
			case 'title':
				drawTitle();
			break;
			case 'game':
				player.draw();
				gameDirector.drawPlatforms();
				gameDirector.scoreboard.draw();
			break;
			case 'gameover':
				drawGameOver();
			break;
		}
	}
	
	const loop = () => {
		update();
		draw();
		window.requestAnimationFrame(loop);
	}

	window.requestAnimationFrame(loop);
	window.addEventListener('keydown', checkKeyBoard, false);
	window.addEventListener('keyup', releaseKey, false);
}