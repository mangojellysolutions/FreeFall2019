const Scoreboard = () => {
	const score = {high: 1000, own: 0};
	let start = 0;
	
	const reset = () => {
		start = Date.now();
		score.own = 0;
	}
		
	const draw = () => {
		ctx.save();
		ctx.fillStyle = 'rgba(0,0,0,0.8)';
		ctx.fillRect(0,canvas.height - 70,canvas.width, 70);
		ctx.lineWidth = 1;
		const blur = 5;
		ctx.shadowColor = '#FFF'
		ctx.shadowOffsetX = 0;
		ctx.shadowOffsetY = 0;
		ctx.shadowBlur = blur;
		ctx.strokeStyle = 'white';
		ctx.font = "30px Arial";
		ctx.textAlign = "left";
		ctx.strokeText("High: "+score.high, 40, canvas.height - 28);
		ctx.textAlign = "right";
		ctx.strokeText("Score: "+score.own, canvas.width - 40, canvas.height - 28);
		ctx.restore();
	}
	
	const update = () => {
		score.own += (Date.now() - start);
		if (score.own > score.high)
			score.high = score.own;
		start = Date.now();
	}
	
	const increaseScore = (val) => score.own += val;
	
	return { reset, draw, update, increaseScore }
}