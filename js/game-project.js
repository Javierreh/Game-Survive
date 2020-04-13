import {canvas, ctx, clearCanvas} from './canvas.js';
import Background from './background.js';
import Player from './player.js';
const background = new Background();
const player = new Player();
const bullets = [];

const keys = {
  up: false,
  down: false,
  left: false,
  right: false,
  shootUp: false,
  shootDown: false,
  shootLeft: false,
  shootRight: false
};

setInterval(main, 33);

function main() {
  update();
  draw();
}

function update() {
  player.move(keys, background);
  if (player.checkLastShotDate() && player.shoot(keys)) {
    bullets.push(player.shoot(keys));
  }
  bullets.forEach((bullet, i, arr) => {
    bullet.move();
    if (bullet.remove(background)) arr.splice(i, 1);
  });
}

function draw() {
  clearCanvas();
  background.draw(ctx);
  player.draw(ctx);
  bullets.forEach(bullet => bullet.draw(ctx));
}

window.onkeydown = function(event) {
  if (event.keyCode === 65) keys.left = true;
  if (event.keyCode === 87) keys.up = true;
  if (event.keyCode === 68) keys.right = true;
  if (event.keyCode === 83) keys.down = true;
  if (event.keyCode === 37) keys.shootLeft = true;
  if (event.keyCode === 38) keys.shootUp = true;
  if (event.keyCode === 39) keys.shootRight = true;
  if (event.keyCode === 40) keys.shootDown = true;
};

window.onkeyup = function(event) {
  if (event.keyCode === 65) keys.left = false;
  if (event.keyCode === 87) keys.up = false;
  if (event.keyCode === 68) keys.right = false;
  if (event.keyCode === 83) keys.down = false;
  if (event.keyCode === 37) keys.shootLeft = false;
  if (event.keyCode === 38) keys.shootUp = false;
  if (event.keyCode === 39) keys.shootRight = false;
  if (event.keyCode === 40) keys.shootDown = false;
};
