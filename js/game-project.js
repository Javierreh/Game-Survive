import {canvas, ctx, clearCanvas} from './canvas.js';
import Background from './background.js';
import Player from './player.js';
import Enemy from './enemy.js';
const background = new Background();
const player = new Player();
const bullets = [];
let bulletLastDate = null;
let millisecodsBetweenShot = 250;
const enemies = [];
let lastEnemyDate = null;

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
  // Move Player
  player.move(keys, background);

  // Shoot bullet
  if (checkLastDate(bulletLastDate, millisecodsBetweenShot) && player.shoot(keys)) {
    bulletLastDate = new Date();
    bullets.push(player.shoot(keys));
  }

  // Move bullets
  bullets.forEach((bullet, i, arr) => {
    bullet.move();
    if (bullet.remove(background)) arr.splice(i, 1);
  });
  
  // Insert new enemy
  if (enemies.length < 24) {
    if (checkLastDate(lastEnemyDate, getRandomNumber(500, 10000))) {
      lastEnemyDate = new Date();
      const position = getEnemyRespawnPosition();
      enemies.push(new Enemy(position.x, position.y));
    }
  }

  // Move enemies
  enemies.forEach(enemy => enemy.move(enemies, player));
}

function draw() {
  clearCanvas();
  background.draw(ctx);
  bullets.forEach(bullet => bullet.draw(ctx));
  enemies.forEach(enemy => enemy.draw(ctx));
  player.draw(ctx);
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

// Functions

function checkLastDate(lastDate, milliseconds) {
  const currentDate = new Date();
  if (currentDate - lastDate < milliseconds) {
    return false;
  }
  return true;
}

function getRandomNumber(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

function getEnemyRespawnPosition() {
  const options = [
    {x: 340, y: 0}, {x: 380, y: 0}, {x: 420, y: 0},
    {x: 660, y: 240}, {x: 660, y: 280}, {x: 660, y: 320},
    {x: 340, y: 560}, {x: 380, y: 560}, {x: 420, y: 560},
    {x: 100, y: 240}, {x: 100, y: 280}, {x: 100, y: 320}
  ];
  const randomNumber = getRandomNumber(0, 11);
  return options[randomNumber];
}

// function dist(x1, x2, y1, y2) {
//   let a = x1 - x2;
//   let b = y1 - y2;
//   let result = Math.sqrt(a*a + b*b);
//   return result;
// }
