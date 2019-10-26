const Platform = (x, y, width) => {
	const speed = (width / brickSize.width);
	const position  = { x:x, y:y };
	const idx = (width / brickSize.width)-1
	const draw = () => ctx.drawImage(platformImg[idx],position.x,position.y);
	const move = () => position.y -= speed;
	const getPosition = () =>  position; 
	
	const inBounds = (testX, testY) => {
		if (testX >= position.x && testX <= position.x + width){
			if(testY >= position.y && testY <= position.y +  brickSize.height){
				return true;
			}
		}
		return false;
	}
	return { draw, move, inBounds, getPosition }
}