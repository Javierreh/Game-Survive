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
  size: sizeElement,
  velocity: 5
};

const Keys = {
  up: false,
  down: false,
  left: false,
  right: false,
  shootUp: false,
  shootDown: false,
  shootLeft: false,
  shootRight: false
};

const bullets = [];
let bulletSize = player.size / 6;
let bulletVelocity = 10;
let millisecodsBetweenBullets = 250;
let lastBulletDate = null;

setInterval(main, 33);

function main() {
  update();
  draw();
}

function update() {
  movePlayer();
  shootBullet();
  moveBullets();
}

function draw() {
  cleanCanvas();
  drawBackground();
  drawPlayer();
  drawBullets();
}

window.onkeydown = function(event) {
  if (event.keyCode === 65) Keys.left = true;
  if (event.keyCode === 87) Keys.up = true;
  if (event.keyCode === 68) Keys.right = true;
  if (event.keyCode === 83) Keys.down = true;
  if (event.keyCode === 37) Keys.shootLeft = true;
  if (event.keyCode === 38) Keys.shootUp = true;
  if (event.keyCode === 39) Keys.shootRight = true;
  if (event.keyCode === 40) Keys.shootDown = true;
};

window.onkeyup = function(event) {
  if (event.keyCode === 65) Keys.left = false;
  if (event.keyCode === 87) Keys.up = false;
  if (event.keyCode === 68) Keys.right = false;
  if (event.keyCode === 83) Keys.down = false;
  if (event.keyCode === 37) Keys.shootLeft = false;
  if (event.keyCode === 38) Keys.shootUp = false;
  if (event.keyCode === 39) Keys.shootRight = false;
  if (event.keyCode === 40) Keys.shootDown = false;
};

function cleanCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBackground() {
  // Draw Game Area
  ctx.beginPath();
  ctx.rect(startX, startY, gameAreaSize, gameAreaSize);
  ctx.strokeStyle = "black";
  ctx.stroke();

  // Draw background borders
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

function movePlayer() {
  let dx = 0;
  let dy = 0;
  if (Keys.up) dy = -player.velocity; 
  if (Keys.down) dy = player.velocity;
  if (Keys.left) dx = -player.velocity;
  if (Keys.right) dx = player.velocity;
  if (dx !== 0 && dy !== 0) {
    player.x += dx / 1.5;
    player.y += dy / 1.5;
  } 
  else if (dx !== 0 || dy !== 0) {
    player.x += dx;
    player.y += dy;
  }
  limitPlayerPosition();
}

function limitPlayerPosition() {
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

function shootBullet() {
  if (!checkLastBulletDate()) return false;
  let dx = 0;
  let dy = 0;
  if (Keys.shootUp) dy = -bulletVelocity;
  if (Keys.shootDown) dy = bulletVelocity;
  if (Keys.shootLeft) dx = -bulletVelocity;
  if (Keys.shootRight) dx = bulletVelocity;
  if (dx !== 0 && dy !== 0) createBullet(dx / 1.5, dy / 1.5);
  else if (dx !== 0 || dy !== 0) createBullet(dx, dy);
}

function checkLastBulletDate() {
  const currentDate = new Date();
  if (currentDate - lastBulletDate < millisecodsBetweenBullets) {
    return false;
  }
  return true;
}

function createBullet(dx, dy) {
  const newBullet = { 
    x: player.x + player.size / 2,
    y: player.y + player.size / 2,
    createDate: new Date(),
    size: bulletSize,
    dx: dx,
    dy: dy
  }
  lastBulletDate = newBullet.createDate;
  bullets.push(newBullet);
}

function drawBullets() {
  bullets.forEach(bullet => {
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.size, 0, 2 * Math.PI);
    ctx.fillStyle = "gold";
    ctx.fill();
  });
}

function moveBullets() {
  bullets.forEach((bullet, i, arr) => {
    bullet.x += bullet.dx;
    bullet.y += bullet.dy;
    if (bullet.x < startX + sizeElement ||
        bullet.x > lastX - sizeElement ||
        bullet.y < startY + sizeElement ||
        bullet.y > lastY - sizeElement) {
      arr.splice(i, 1);
    }
  });
}
