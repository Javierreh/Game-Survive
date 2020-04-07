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
  move: 10
}

let Keys = {
  up: false,
  down: false,
  left: false,
  right: false
};

setInterval(main, 100);

function main() {
  update();
  draw();
}

function update() {
  movePlayer();
  fixPlayerPosition();

}

function draw() {
  drawBackground();
  drawPlayer();
}

function drawBackground() {
  // Clean background
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw Game Area
  ctx.fillStyle = "black";
  ctx.beginPath();
  ctx.rect(startX, startY, gameAreaSize, gameAreaSize);
  ctx.stroke();

  // Draw background border
  // Top border
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

window.onkeydown = function(event){
  if (event.keyCode === 37) Keys.left = true;
  if (event.keyCode === 38) Keys.up = true;
  if (event.keyCode === 39) Keys.right = true;
  if (event.keyCode === 40) Keys.down = true;
};

window.onkeyup = function(event){
  if (event.keyCode === 37) Keys.left = false;
  if (event.keyCode === 38) Keys.up = false;
  if (event.keyCode === 39) Keys.right = false;
  if (event.keyCode === 40) Keys.down = false;
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
