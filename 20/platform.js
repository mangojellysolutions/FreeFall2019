const Platform = (x, y, width) => {
	const speed = (width / brickSize.width);
	const position  = { x:x, y:y };
	const draw = () => ctx.drawImage(platformImg,position.x,position.y, width, brickSize.height);
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