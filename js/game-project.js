const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

const sizeElement = 40;
const gameAreaSize = 600;
const startX = 100;
const lastX = startX + gameAreaSize;
const startY = 0;
const lastY = startY + gameAreaSize;

const player = {
  x: sizeElement * 7 + startX,
  y: sizeElement * 7 + startY,
  size: 40,
  move: 5
};

let Keys = {
  up: false,
  down: false,
  left: false,
  right: false
};

const bulletMovement = 10;
const bullets = [];
let millisecodsBetweenBullets = 250;

setInterval(main, 33);

function main() {
  update();
  draw();
}

function update() {
  movePlayer();
  fixPlayerPosition();
  // console.log(bullets);
  moveBullets();
}

function draw() {
  drawBackground();
  drawPlayer();
  bullets.forEach(bullet => drawBullets(bullet));
}

function drawBackground() {
  // Clean background
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Game Area
  ctx.beginPath();
  ctx.rect(startX, startY, gameAreaSize, gameAreaSize);
  ctx.strokeStyle = "black";
  ctx.stroke();

  // Draw background border
  // Top border
  ctx.fillStyle = "black";
  ctx.fillRect(startX, startY, sizeElement * 6, sizeElement * 1);
  ctx.fillRect(lastX, startY, -sizeElement * 6, sizeElement * 1);

  // Bottom border
  ctx.fillRect(startX, lastY, sizeElement * 6, -sizeElement * 1);
  ctx.fillRect(lastX, lastY, -sizeElement * 6, -sizeElement * 1);

  // Left border
  ctx.fillRect(startX, startY, sizeElement * 1, sizeElement * 6);
  ctx.fillRect(startX, lastY, sizeElement * 1, -sizeElement * 6);

  // Right border
  ctx.fillRect(lastX, startY, -sizeElement * 1, sizeElement * 6);
  ctx.fillRect(lastX, lastY, -sizeElement * 1, -sizeElement * 6);
}

function drawPlayer() {
  ctx.fillStyle = "darkgreen";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

window.onkeydown = function(event) {
  if (event.keyCode === 65) Keys.left = true;
  if (event.keyCode === 87) Keys.up = true;
  if (event.keyCode === 68) Keys.right = true;
  if (event.keyCode === 83) Keys.down = true;

  if (event.keyCode === 37) createBullet(-bulletMovement, 0);
  if (event.keyCode === 38) createBullet(0, -bulletMovement);
  if (event.keyCode === 39) createBullet(bulletMovement, 0);
  if (event.keyCode === 40) createBullet(0, bulletMovement);

};

window.onkeyup = function(event) {
  if (event.keyCode === 65) Keys.left = false;
  if (event.keyCode === 87) Keys.up = false;
  if (event.keyCode === 68) Keys.right = false;
  if (event.keyCode === 83) Keys.down = false;
};

function movePlayer() {
  if (Keys.up) {
    player.y -= player.move;
  }
  if (Keys.down) {
    player.y += player.move;
  }
  if (Keys.left) {
    player.x -= player.move;
  }
  if (Keys.right) {
    player.x += player.move;
  }
}

function fixPlayerPosition() {
  if (player.x < startX + sizeElement) {
    player.x = startX + sizeElement;
  }
  if (player.x > lastX - sizeElement * 2) {
    player.x = lastX - sizeElement * 2;
  }
  if (player.y < startY + sizeElement) {
    player.y = startY + sizeElement;
  }
  if (player.y > lastY - sizeElement * 2) {
    player.y = lastY - sizeElement * 2;
  }
}

function createBullet(dx, dy) {
  const newBullet = { 
    x: player.x + player.size / 2,
    y: player.y + player.size / 2,
    createTime: new Date(),
    size: player.size / 6,
    dx: dx,
    dy: dy
  }
  if (checkBulletTime(newBullet)) {
    bullets.push(newBullet);
  }
}

function checkBulletTime(newBullet) {
  if (bullets.length > 0) {
    const lastBullet = bullets[bullets.length - 1];
    if (newBullet.createTime - lastBullet.createTime < millisecodsBetweenBullets) {
      return false;
    }
  }
  return true;
}

function drawBullets(bullet) {
  ctx.beginPath();
  ctx.arc(bullet.x, bullet.y, bullet.size, 0, 2 * Math.PI);
  ctx.fillStyle = "gold";
  ctx.fill();
}

function moveBullets() {
  bullets.forEach(bullet => {
    bullet.x += bullet.dx;
    bullet.y += bullet.dy;
  });
}
