const BackgroundHandler = () => {
	let yScrollOffset1 = 0;
	let yScrollOffset2 = canvas.height;
	let yScrollOffsetA = 0;
	let yScrollOffsetB = canvas.height;
	let scrollSpeed1 = 8;
	let scrollSpeed2 = 5;
	
	const drawHex = (ctx, strokeColour, fillColour , size, x, y) => {
		ctx.beginPath();
		ctx.moveTo(x + size * Math.cos(0), y + size * Math.sin(0));
		
		for (let side = 0; side < 7; side++) {
		  let newX = x + size * Math.cos(side * 2 * Math.PI / 6);
		  let newY = y + size * Math.sin(side * 2 * Math.PI / 6);
		  ctx.lineTo(newX, newY);
		}
		
		if (fillColour != null ){
			ctx.fillStyle = fillColour;
			ctx.fill();
		}
		ctx.stroke();
	}
	const neonHex = (ctx,r,g,b, fillColour,size,x,y) => {
		const alpha = 0.1;
		ctx.shadowColor = "rgb("+r+","+g+","+b+")";
		ctx.shadowBlur = 10;
		ctx.strokeStyle= "rgba("+r+","+g+","+b+","+alpha+")";
		ctx.lineWidth=7.5;
		drawHex(ctx, ctx.strokeStyle, null, size, x, y);
		ctx.strokeStyle= "rgba("+r+","+g+","+b+","+alpha+")";
		ctx.lineWidth=6;
		drawHex(ctx, ctx.strokeStyle, null, size, x, y);
		ctx.strokeStyle= "rgba("+r+","+g+","+b+","+alpha+")";
		ctx.lineWidth=4.5;
		drawHex(ctx, ctx.strokeStyle, null, size, x, y);
		ctx.strokeStyle= "rgba("+r+","+g+","+b+","+alpha+")";
		ctx.lineWidth=3;
		drawHex(ctx, ctx.strokeStyle, null, size, x, y);
		ctx.strokeStyle= '#fff';
		ctx.lineWidth=1.5;
		drawHex(ctx, ctx.strokeStyle, fillColour, size, x, y);
	}
	
	const drawGroup = (ctx, dimension, size, r,g,b, fillColour, lineWidth) => {
		let yMultiplier =0;
		let yOffset = size - (size / 7.5);
		let xOffset = size + size / 2;
		for (let i = 0; i < 10 * dimension; i++){
			neonHex(ctx,r,g,b, fillColour, size, 0, yOffset * yMultiplier);
			yMultiplier += 2;
		}
		yMultiplier =0;
		for (let i = 0; i < 10 * dimension; i++){
			if (i % 2 == 1){
				neonHex(ctx,r,g,b, fillColour, size, xOffset,yOffset + yOffset * yMultiplier);
				
			}
			yMultiplier += 2;
		}
	}

	const getImage = (width, height, r,g,b, fillColour) => {
		let newCanvas = document.createElement('canvas');
		newCanvas.width = width * 2.5;
		newCanvas.height = height;
		newCtx = newCanvas.getContext('2d');
		//fill the canvas with full transparency
		newCtx.fillStyle = 'rgba(0,0,0,0.0)';
		newCtx.fillRect(0, 0, newCanvas.width, newCanvas.height);
		drawGroup(newCtx, 1, width, r,g,b,fillColour, 1);
		var newImage = document.createElement('img');
		//create a png with full tansparency
		newImage.src = canvasToImage(newCanvas,newCtx,'rgba(00,0,0,0.0)');
		newCanvas = null;
		return newImage;
	}
	let backGround = getImage( 115 , canvas.height, 63,255,255,  'rgba(63,8,191,0.1)');
	let foreGround =  getImage( 50  , canvas.height, 63,255,255,  'rgba(63,127,191,0.2)');

	const update = () => {
		yScrollOffset1 -= scrollSpeed1;
		yScrollOffset2 -= scrollSpeed1;
		if (yScrollOffset1 == -canvas.height){
			yScrollOffset1 = canvas.height;
		}
		if (yScrollOffset2 == -canvas.height){
			yScrollOffset2 = canvas.height;
		}
		yScrollOffsetA -= scrollSpeed2;
		yScrollOffsetB -= scrollSpeed2;
		if (yScrollOffsetA == -canvas.height){
			yScrollOffsetA = canvas.height;
		}
		if (yScrollOffsetB == -canvas.height){
			yScrollOffsetB = canvas.height;
		}
	}
	
	const draw = () => {
		let foregroundLeft = {start: 0, end: canvas.width / 8};
		let foregroundRight = {start: canvas.width - canvas.width / 8, end: canvas.width};
		let backgroundLeft = {start: foregroundLeft.end, end: foregroundLeft.end + canvas.width / 8};
		let backgroundRight = {start: foregroundRight.start - canvas.width / 8, end: foregroundRight.start};
	
		ctx.fillStyle = 'darkblue';
		ctx.fillRect(0,0,canvas.width, canvas.height);
		ctx.drawImage(mainBackground,0,0,canvas.width, canvas.height);
	
		ctx.save();
		ctx.translate(canvas.width, 0);
		ctx.scale(-1, 1);
		ctx.drawImage(backGround,0,yScrollOffset1);
		ctx.drawImage(backGround,0,yScrollOffset2);
		
		ctx.drawImage(foreGround,0,yScrollOffsetA);
		ctx.drawImage(foreGround,0,yScrollOffsetB);
		
		ctx.restore();
		ctx.drawImage(backGround,0,yScrollOffset1);
		ctx.drawImage(backGround,0,yScrollOffset2);
		
		ctx.drawImage(foreGround,0,yScrollOffsetA);
		ctx.drawImage(foreGround,0,yScrollOffsetB);
	}
	return { draw, update }
}