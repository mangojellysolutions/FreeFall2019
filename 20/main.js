			
			let canvas = null;
			let ctx = null;
			const mainBackground = new Image();
			const brickSize = {width: 64, height: 32};
			let platformImg = null;
			const canvasToImage = (theCanvas,context,backgroundColor) => {	
				var w = canvas.width;
				var h = canvas.height;
				var data;		
				if(backgroundColor){
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
		const init = () => {			
			canvas = document.getElementById('canvas');
			ctx = canvas.getContext('2d');
			
			
			
			mainBackground.src = "grafix/stars.jpg";
			
			function getRandomArbitrary(min, max) {
				return Math.random() * (max - min) + min;
			}
			
			function getRandomInt(min, max) {
				min = Math.ceil(min);
				max = Math.floor(max);
				return Math.floor(Math.random() * (max - min + 1)) + min;
			}
			
			const renderPlaformToImage = () => {
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
					let newX = position.x + brickSize.width;
					let newY = position.y;
					  newCtx.lineTo(newX, newY);
					  corners.push({x:newX, y:newY});
					  newY = position.y + brickSize.height;
					  newX = newX -= (brickSize.height/2);
					  newCtx.lineTo(newX, newY);
					  corners.push({x:newX, y:newY});
					  newX -= brickSize.width - brickSize.height;
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
					console.log(brickSize.width);
					newCanvas.width =  brickSize.width + 20;
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
			
				let fg =  renderPlaformToImage();
				 platformImg = fg.getImage();
				
					
		
			const GameDirector = () => {
				const scoreboard = Scoreboard();
				const spawnInterval = 10000;
				let timeElaspedSinceLastSpawn = 0;
				let platforms = [];
				let spawnedAt = 0;
				
			
				const resetGame = () => {
					scoreboard.reset();
					platforms = [];
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
						x += (platformWidth * brickSize.width) + emptySpaceDistribution;
					}
				
					spawnAt = Date.now();
				}
				
				const drawPlatforms = () => {
					for (platform of platforms){
						platform.draw();
					}
				}
				
				const collidedWithPlatform = (thePlayer) => {
					for (platform of platforms){
						if (platform.inBounds(thePlayer.getPosition().x, thePlayer.getPosition().y)){
							thePlayer.getPosition().y = platform.getPosition().y;
							return true;
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
					timeElaspedSinceLastSpawn += (Date.now() - spawnAt);
					if (timeElaspedSinceLastSpawn > spawnInterval){
						spawnPlatforms();
						timeElaspedSinceLastSpawn = 0;
					}
				}
				return { resetGame, spawnPlatforms, drawPlatforms, collidedWithPlatform, movePlatforms, scoreboard }
			}
			
			const  drawTitle = () => {
				ctx.fillStyle = 'black';
				ctx.font = "80px Arial";
				ctx.textAlign = "center";
				ctx.fillText("Free Fall 2019", canvas.width/2, canvas.height/2);
			}
			
			const drawGameOver = () => {
				ctx.fillStyle = 'black';
				ctx.font = "80px Arial";
				ctx.textAlign = "center";
				ctx.fillText("Game Over", canvas.width/2, canvas.height/2);
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
						state = 'game';
						gameDirector.scoreboard.reset();
						gameDirector.spawnPlatforms();
					break;
					case 'game':
						player.setState(e.keyCode);
					break;
					case 'gameover':
						state = 'title';
					break;
				}  
			}
			
			const releaseKey = () =>  player.setState(null);
			
			
			let state = 'title';
			const player =  Player(220,100);
			const gameDirector = GameDirector();
			const backgroundHandler = BackgroundHandler();
			
			const update = () => backgroundHandler.update();
			
			const loop = () => {
				update();
				ctx.clearRect(0,0, canvas.width, canvas.height);
				
				backgroundHandler.draw();
				
				
				switch (state){
					case 'title':
						drawTitle();
					break;
					
					case 'game':
						gameDirector.scoreboard.update();
						player.move();
						player.animate();
						gameDirector.movePlatforms();
						player.drop(gameDirector.collidedWithPlatform(player));	
						checkPlayerInBoundsOfScreen();
						
						gameDirector.scoreboard.draw();
						player.draw();
						gameDirector.drawPlatforms();
					break;
					
					case 'gameover':
						drawGameOver();
					break;
				}
				window.requestAnimationFrame(loop);
			}
			
			window.requestAnimationFrame(loop);
			window.addEventListener('keydown', checkKeyBoard, false);
			window.addEventListener('keyup', releaseKey, false);

}