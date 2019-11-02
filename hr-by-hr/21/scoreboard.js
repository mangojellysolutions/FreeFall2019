const Scoreboard = () => {
				const score = {high: 1000, own: 0};
				let start = 0;
				
				const reset = () => {
					start = Date.now();
					score.own = 0;
				}
				const draw = () => {
					ctx.fillStyle = 'lightgrey';
					ctx.fillRect(20,canvas.height - 70,canvas.width-30, 60);
					ctx.fillStyle = 'black';
					ctx.font = "30px Arial";
					ctx.textAlign = "left";
					ctx.fillText("High Score: "+score.high, 40, canvas.height - 28);
					ctx.textAlign = "right";
					ctx.fillText("Own Score: "+score.own, canvas.width - 40, canvas.height - 28);
				}
				
				const update = () => {
					score.own += (Date.now() - start);
					if (score.own > score.high)
						score.high = score.own;
					start = Date.now();
				}
				
				return { reset, draw, update }
			}