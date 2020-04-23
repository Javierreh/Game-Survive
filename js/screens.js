function drawStartScreen(background, ctx, score, lifes, ammunition, timeLimit) {
  let color = '#03BDE8';
  // Draw basic structure
  structureScreen(background, ctx, score, lifes, ammunition, timeLimit, color);

  // Title
  ctx.fillStyle = 'black';
  ctx.font = 'bold 28px Arial';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillText('Can you defeat', 370, 137);
  ctx.fillText('1000 enemies?', 430, 172);

  // Press space to start
  ctx.fillStyle = 'black';
  ctx.font = 'bold 21px Arial';
  ctx.fillText('Press the space bar to start', 400, 490);

  // Player
  ctx.fillStyle = 'darkgreen';
  ctx.fillRect(200, 225, 40, 40);
  ctx.fillStyle = 'black';
  ctx.font = '20px Arial';
  ctx.fillText('Player', 220, 290);
  
  // Enemy
  ctx.fillStyle = 'red';
  ctx.fillRect(290, 225, 40, 40);
  ctx.fillStyle = 'black';
  ctx.fillText('Enemy', 310, 290);

  // Bullet
  ctx.beginPath();
  ctx.arc(400, 245, 20, 0, 2 * Math.PI);
  ctx.fillStyle = 'gold';
  ctx.fill();
  ctx.fillStyle = 'black';
  ctx.fillText('Bullet', 400, 290);

  // Time
  ctx.beginPath();
  ctx.fillStyle = 'blue';
  ctx.moveTo(470, 230);
  ctx.lineTo(510, 230);
  ctx.lineTo(490, 265);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'black';
  ctx.fillText('Timer', 490, 290);

  // Bomb
  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.moveTo(580, 225);
  ctx.lineTo(560, 245);
  ctx.lineTo(580, 265);
  ctx.lineTo(600, 245);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'black';
  ctx.fillText('Bomb', 580, 290);

  // Controls
  // Move and shoot
  ctx.fillStyle = 'black';
  ctx.fillText('Move  |  Shoot', 400, 370);
  // Box W A S D & Arrows
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 1.5;
  ctx.shadowOffsetX = 1.5;
  ctx.shadowOffsetY = 1.5;
  ctx.fillStyle = 'gray';
  ctx.fillRect(275, 355, 30, 30);
  ctx.fillRect(240, 390, 30, 30);
  ctx.fillRect(275, 390, 30, 30);
  ctx.fillRect(310, 390, 30, 30);
  ctx.fillRect(495, 355, 30, 30);
  ctx.fillRect(460, 390, 30, 30);
  ctx.fillRect(495, 390, 30, 30);
  ctx.fillRect(530, 390, 30, 30);
  // W A S D
  ctx.fillStyle = 'white';
  ctx.fillText('W', 290, 378);
  ctx.fillText('A', 255, 413);
  ctx.fillText('S', 290, 413);
  ctx.fillText('D', 325, 413);
  // Arrow Up
  ctx.shadowBlur = 1;
  ctx.shadowOffsetX = 1;
  ctx.shadowOffsetY = 1;
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.moveTo(502.5, 373);
  ctx.lineTo(517.5, 373);
  ctx.lineTo(510, 361);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(509, 373, 2, 6);
  // Arrow LEFT
  ctx.beginPath();
  ctx.moveTo(478, 398);
  ctx.lineTo(478, 413);
  ctx.lineTo(466, 405.5);
  ctx.closePath();
  ctx.fill();
  ctx.fillRect(478, 404.5, 6, 2);
  // Arrow DOWN
  ctx.fillRect(509, 396, 2, 6);
  ctx.beginPath();
  ctx.moveTo(502.5, 402);
  ctx.lineTo(517.5, 402);
  ctx.lineTo(510, 414);
  ctx.closePath();
  ctx.fill();
  // Arrow RIGHT
  ctx.fillRect(536, 404.5, 6, 2);
  ctx.beginPath();
  ctx.moveTo(542, 398);
  ctx.lineTo(542, 413);
  ctx.lineTo(554, 405.5);
  ctx.closePath();
  ctx.fill();

  // Remove shadows
  removeBorderShadow(ctx);
}

function drawGameOverScreen(statusGame, background, ctx, score, lifes, ammunition, timeLimit) {
  let message, color;
  if (statusGame === "win") {
    message = "YOU WIN!";
    color = "#4DFF40";
  } 
  if (statusGame === "lose") {
    message = "YOU LOSE!";
    color = "#FF4040";
  } 

  // Draw basic structure
  structureScreen(background, ctx, score, lifes, ammunition, timeLimit, color);

  // YOU LOSE! / YOU WIN!
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillStyle = 'black';
  ctx.font = 'bold 38px Verdana';
  ctx.fillText(message, 400, 160);

  // Score
  ctx.fillStyle = 'black';
  ctx.font = 'bold 22px Courier New';
  ctx.fillText('SCORE:', 240, 230);

  // Figures
  ctx.fillStyle = 'red';
  ctx.fillRect(243, 250, 30, 30);
  ctx.beginPath();
  ctx.arc(258, 300, 15, 0, 2 * Math.PI);
  ctx.fillStyle = 'gold';
  ctx.fill();
  ctx.beginPath();
  ctx.fillStyle = 'blue';
  ctx.moveTo(243, 320);
  ctx.lineTo(274, 320);
  ctx.lineTo(258.5, 346);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = 'darkgreen';
  ctx.fillRect(243, 351, 30, 30);

  // Amount
  ctx.fillStyle = 'black';
  ctx.textAlign = "center";
  ctx.font = '20px Courier New';
  ctx.fillText(score, 310, 270);
  ctx.fillText(ammunition, 310, 305);
  ctx.fillText(Math.round(timeLimit), 310, 340);
  ctx.fillText(lifes, 310, 375);

  // X score
  ctx.fillText('X  100  --->', 430, 270);
  ctx.fillText('X  50   --->', 430, 305);
  ctx.fillText('X  500  --->', 430, 340);
  ctx.fillText('X  1000 --->', 430, 375);

  // Element total score
  ctx.font = 'bold 20px Courier New';
  ctx.fillText(score * 100, 560, 270);
  ctx.fillText(ammunition * 50, 560, 305);
  ctx.fillText(Math.round(timeLimit) * 500, 560, 340);
  ctx.fillText(lifes * 1000, 560, 375);

  // Total
  ctx.fillStyle = 'black';
  ctx.font = 'bold 22px Courier New';
  ctx.fillText('TOTAL:', 240, 430);

  // Background total score
  ctx.beginPath();
  ctx.ellipse(400, 425, 25, 80, Math.PI / 2, 0, 2 * Math.PI);
  ctx.fillStyle = '#03BDE8';
  ctx.fill();

  // Global Total Score
  ctx.fillStyle = 'black';
  ctx.font = 'bold 28px Verdana';
  ctx.fillText((score * 100) + (ammunition * 50) + (Math.round(timeLimit) * 500) + (lifes * 1000), 400, 435);

  // Press space to restart
  ctx.fillStyle = 'black';
  ctx.font = 'bold 21px Arial';
  ctx.fillText('Press the space bar to restart', 400, 490);

  // Remove shadows
  removeBorderShadow(ctx);
}

function structureScreen(background, ctx, score, lifes, ammunition, timeLimit, color) {
  // Scene
  background.draw(ctx, score, lifes, ammunition, timeLimit);
  // Background screen
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = 'lightgray';
  ctx.fillRect(175, 75, 450, 450);
  // Background title
  ctx.beginPath();
  ctx.ellipse(400, 145, 55, 175, Math.PI / 2, 0, 2 * Math.PI);
  ctx.fillStyle = color;
  ctx.fill();
}

function removeBorderShadow(ctx) {
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}

export { drawStartScreen, drawGameOverScreen };