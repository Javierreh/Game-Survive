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
    // Check nullet collision with enemies
    enemies.forEach((enemy, j, arr2) => {
      if (bulletCollision(bullet, enemy)) {
        arr.splice(i, 1);
        arr2.splice(j, 1);
      }
    });
    // Check bullet collision with others obtacles
    const obstacles = [...background.borders, ...background.respawns];
    if (obstacles.some(obs => bulletCollision(bullet, obs))) {
      arr.splice(i, 1);
    }
    bullet.move();
  });
  
  // Insert new enemy
  if (enemies.length < 24) {
    if (checkLastDate(lastEnemyDate, getRandomNumber(500, 5000))) {
      lastEnemyDate = new Date();
      const position = getEnemyRespawnPosition();
      enemies.push(new Enemy(position.x, position.y));
    }
  }

  // Move enemies
  enemies.forEach((enemy, i, arr) => {
    enemy.move(getShortestStep(enemy, player, [...enemies, ...background.borders]));
  });
}

function draw() {
  clearCanvas();
  background.draw(ctx);
  player.draw(ctx);
  enemies.forEach(enemy => enemy.draw(ctx));
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
  let selected;
  do {
    const randomNumber = getRandomNumber(0, 11);
    selected = options[randomNumber];
    selected.width = 40;
    selected.height = 40;
  } while (enemies.some(enemy => checkCollision(selected, enemy)));
  return selected;
}

function getShortestStep(current, target, elements) {
  const grid = [
    {x: current.x, y: current.y - current.velocity, width: current.width, height: current.height},
    {x: current.x + current.velocity, y: current.y, width: current.width, height: current.height},
    {x: current.x, y: current.y + current.velocity, width: current.width, height: current.height},
    {x: current.x - current.velocity, y: current.y, width: current.width, height: current.height}
  ];
  const available = grid.filter(spot => {
    return !elements.some(element => {
      return checkCollision(spot, element) && element !== current;      
    });
  });
  if (available.length > 0) {
    const distances = available.map(elem => distanceBeetween(elem.x, elem.y, target.x, target.y));
    const indexSelected = distances.indexOf(Math.min(...distances));
    const nextStep = available[indexSelected];
    return nextStep;
  }
}

function distanceBeetween(x1, y1, x2, y2) {
  const a = x1 - x2;
  const b = y1 - y2;
  return Math.sqrt(a*a + b*b);
}

function checkCollision(elem1, elem2) {
  return (elem1.x < elem2.x + elem2.width &&
          elem1.x + elem1.width > elem2.x &&
          elem1.y < elem2.y + elem2.height &&
          elem1.height + elem1.y > elem2.y) ? true : false;
}

function bulletCollision(circle, rect) {
  const distX = Math.abs(circle.x - rect.x - rect.width / 2);
  const distY = Math.abs(circle.y - rect.y - rect.height / 2);
  if (distX > (rect.width / 2 + circle.radius)) return false;
  if (distY > (rect.height / 2 + circle.radius)) return false;
  if (distX <= (rect.width / 2)) return true;
  if (distY <= (rect.height / 2)) return true;
  const dx = distX - rect.width / 2;
  const dy = distY - rect.height / 2;
  return (dx * dx + dy * dy <= (circle.radius * circle.radius));
}
