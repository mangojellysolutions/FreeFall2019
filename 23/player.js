const Player = (x ,y) => {
	const size = {w: 32, h: 32};
	const position  = { x:x, y:y };
	let speed = 0;
	const defaultFallRate = 1.5;
	const maxFallRate = 10;
	let refreshCount = 0;
	let frameIdx = 0;
	let fallRate = defaultFallRate;
	let state = 'static';
	let distanceTravelled = 0;
	let isFalling = false;
	let direction = 'right';
	const setState = (keyCode) => {
		//if (isFalling){
		//	state = 'falling';
		//} else {
			switch(keyCode){
				case 37: state = 'left'; direction = state; break; //Left key
				case 38: state = 'jump'; break;//Up key
				case 39: state = 'right'; direction = state; break; //Right key
				case 40: state = 'duck'; break; //Down key
				default: state = 'static'; break;
			}
		//}
	}
	
	const getPosition = () => { return position; }
	
	const setPosition = (x, y) => {
		position.x = x;
		position.y = y;
	}
	
	const animate = () => {
		if (isFalling){
			frameIdx = 1;
			distanceTravelled = 0
		} else {
			switch(state){
				case 'left':
				case 'right':
					distanceTravelled += Math.abs(speed);
					if (distanceTravelled > 5 ){
						frameIdx ++;
						if (frameIdx > 3){
							frameIdx = 0;
						}
						distanceTravelled = 0;
					}
				break;
			}
		}
	}
	
	const draw = () => {
		//should precalculate these images first
		
		if (direction == 'left'){
			ctx.save();
			 ctx.translate(position.x +size.w/2, position.y-size.h/1.5);
			ctx.scale(-1, 1);
			ctx.drawImage(playerFrames[frameIdx],0,0,size.w,size.h);
			ctx.restore();
		} else {
			ctx.drawImage(playerFrames[frameIdx],position.x, position.y-size.h/1.5,size.w,size.h);
		}
	}
	
	const moveRight = () => speed += 0.2
	const moveLeft = () => speed -= 0.2
	
	const skidd = () => {
		if (Math.abs(speed)>0){
			if (speed > 0){
				speed -= 0.2;
				if (speed < 0){
					speed = 0;
				}
			} else
			if (speed < 0){
				speed += 0.2;
				if (speed > 0){
					speed = 0;
				}
			}
		}
	}
	const wrap =() => {
		if (position.x < 0)
			position.x = canvas.width;
		if (position.x > canvas.width)
			position.x = 0;
	}
	
	const move = () => {
		switch(state){
			case 'left': moveLeft(); break;
			case 'right': moveRight();	break;
			default: skidd();
			
		}
		wrap();
		position.x += speed;
	}
	
	const reachedBottomOfScreen = () => {
		if (position.y > canvas.height){
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
				fallRate = fallRate * 1.01;
			}
			position.y += fallRate;
			reachedBottomOfScreen();
		}
	}
	
	return { draw, setState, move, drop, getPosition, setPosition, animate }
}