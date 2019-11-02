const Collectable = (x, y) => {
	const size = { w:10, h:10 }
	const position  = { x:x, y:y };
	const speed = 1;
	let count =0;
	let frame = 0;
	let step = 1;
	
	const draw = () => {
		ctx.save();
		ctx.lineWidth = 2;
		const blur = 5;
		ctx.shadowColor = '#FFF'
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = blur;
		ctx.strokeStyle = 'white';
		ctx.beginPath();
		ctx.ellipse(position.x+5, position.y+2, 1+frame, size.h, Math.PI *2, 0, 2 * Math.PI);
		ctx.stroke();
		ctx.restore();
		count++;
		if (count > 5){
			count = 0;
			frame +=step;
			if (frame > size.w || frame < 0){
				step = -step;
			}
		}
	}
	
	const move = () => position.y -= speed;
	
	const getPosition = () =>  position; 
	
	const getBounds = () => { return {x: position.x, y: position.y+5, width: size.w, height: size.h} }
	
	const drawBounds = () => {
		const rect = getBounds();
		ctx.fillRect(rect.x,rect.y,rect.width, rect.height);
	}
	
	const intersects = (playerBounds) => {
		const rect1 = playerBounds;
		const rect2 = getBounds();
		if (rect1.x < rect2.x + rect2.width &&
		   rect1.x + rect1.width > rect2.x &&
		   rect1.y < rect2.y + rect2.height &&
		   rect1.y + rect1.height > rect2.y) {
			return true;
		} else {
			return false;
		}
	}
	return { draw, move, intersects, getPosition }
}

