const Player = (x ,y) => {
	const position  = { x:x, y:y };
	let speed = 0;
	const defaultFallRate = 2;
	const maxFallRate = 10;
	let refreshCount = 0;
	let frameIdx = 0;
	let fallRate = defaultFallRate;
	let state = 'static';
	let distanceTravelled = 0;
	let isFalling = false;
	const setState = (keyCode) => {
		if (isFalling){
			state = 'falling';
		} else {
			switch(keyCode){
				case 37: state = 'left'; break; //Left key
				case 38: state = 'jump'; break;//Up key
				case 39: state = 'right'; break; //Right key
				case 40: state = 'duck'; break; //Down key
				default: state = 'static'; break;
			}
		}
	}
	
	const getPosition = () => { return position; }
	
	const setPosition = (x, y) => {
		position.x = x;
		position.y = y;
	}
	const animate = () => {
		switch(state){
			case 'left':
			case 'right':
				distanceTravelled += speed;
				if (distanceTravelled > 20){
					frameIdx ++;
					if (frameIdx > 6){
						frameIdx = 0;
					}
					distanceTravelled = 0;
				}
			break;
		}
		
	}
	const draw = () => {
		let offset = frameIdx * 2;
		if (frameIdx > 5){
			offset -=10;
		}
		ctx.beginPath();
		
		ctx.moveTo(position.x,position.y);
		ctx.lineTo(position.x+5, position.y-20);
		ctx.lineTo(position.x-5, position.y-20);
		ctx.lineTo(position.x, position.y);
		ctx.ellipse(position.x, position.y-26+offset, 5, 5,0, 0, 2 * Math.PI);
		ctx.font = "10px Arial";
		ctx.fillText(frameIdx, position.x, position.y+10);
		ctx.fill();	
	}
	const move = () => {
		switch(state){
			case 'left':
					speed -= 0.1;
					
				break;
			case 'right':
					speed += 0.1;
					
				break;
			default:
				if (speed > 0){
					speed -= 0.1;
				}
				if (speed < 0){
					speed += 0.1;
				}
		}
		if (position.x < 0)
			position.x = canvas.width;
		if (position.x > canvas.width)
			position.x = 0;
		position.x += speed;
	}
	
	const reachedBottomOfScreen = () => {
		if (position.y > canvas.width){
			position.y = 0;
			fallRate = defaultFallRate;
		}
	}
	
	const drop = (hasColliedWithPlatform) => {	
		
		if (hasColliedWithPlatform){
			fallRate = defaultFallRate;
			isFalling = false;
		} else {
			isFalling = true;
			if (fallRate < maxFallRate){
				fallRate = fallRate * 1.02;
			}
			position.y += fallRate;
			reachedBottomOfScreen();
		}
	}
	return { draw, setState, move, drop, getPosition, setPosition, animate }
}