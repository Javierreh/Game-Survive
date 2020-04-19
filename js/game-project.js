import Background from './background.js';
import Player from './player.js';
import Enemy from './enemy.js';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
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

let score = 0;
let lifes = 10;
let ammunition = 25;

let timeLimit = 30;
let oldTimeStamp = 0;

let currentAmmunition = null;
let lastAmmunition = null;
let currentTimer = null;
let lastTimer = null;

const respawn = {
  enemy: {
    time: {
      min: 2000,
      max: 3000
    },
    quantity: {
      min: 1,
      max: 1
    },
    size: 40
  },
  ammunition: {
    time: {
      min: 3000,
      max: 8000
    },
    lastDate: new Date()
  },
  timer: {
    lastDate: new Date(),
    time: {
      min: 5000,
      max: 7000
    }
  }
};

let stoppedGame = false;

window.requestAnimationFrame(gameLoop);

function gameLoop(timeStamp) {
  if (!stoppedGame) {
    timeLimit -= (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    if (timeLimit < 0) timeLimit = 0;
    update();
    draw();
    window.requestAnimationFrame(gameLoop);
  }
}

function update() {
  // Check game over
  if (lifes < 1 || timeLimit === 0) {
    stoppedGame = true;
    // Game Over function here
  }

  // Check difficulty
  checkDifficulty();

  // Respawn Ammunition
  if (checkLastDate(respawn.ammunition.lastDate, getRandomNumber(respawn.ammunition.time.min, respawn.ammunition.time.max)) && !currentAmmunition) {
    currentAmmunition = getSupply(lastAmmunition);
    lastAmmunition = currentAmmunition;
  }
  // Ammunition collision
  if (currentAmmunition && bulletCollision(currentAmmunition, player)) {
    currentAmmunition = null;
    respawn.ammunition.lastDate = new Date();
    ammunition += 10;
  }

  // Respawn Timer
  if (checkLastDate(respawn.timer.lastDate, getRandomNumber(respawn.timer.time.min, respawn.timer.time.max)) && !currentTimer) {
    currentTimer = getSupply(lastTimer);
    lastTimer = currentTimer;
  }
  // Timer collision
  if (currentTimer && bulletCollision(currentTimer, player)) {
    currentTimer = null;
    respawn.timer.lastDate = new Date();
    timeLimit += 10;
    if (timeLimit > 60) timeLimit = 60;
  }

  // Move Player
  player.move(keys, background);

  // Shoot bullet
  if (checkLastDate(bulletLastDate, millisecodsBetweenShot) && player.shoot(keys) && ammunition > 0) {
    bulletLastDate = new Date();
    bullets.push(player.shoot(keys));
    ammunition--;
  }

  // Move bullets
  bullets.forEach((bullet, i, arr) => {
    // Check bullet collision with enemies
    enemies.forEach((enemy, j, arr2) => {
      if (bulletCollision(bullet, enemy)) {
        arr.splice(i, 1);
        arr2.splice(j, 1);
        score++;
      }
    });
    // Check bullet collision with others obstacles
    const obstacles = [...background.borders, ...background.respawns];
    if (obstacles.some(obs => bulletCollision(bullet, obs))) {
      arr.splice(i, 1);
    }
    bullet.move();
  });
  
  // Insert new enemy
  if (enemies.length < 30) {
    if (checkLastDate(lastEnemyDate, getRandomNumber(respawn.enemy.time.min, respawn.enemy.time.max))) {
      lastEnemyDate = new Date();
      const newEnemies = getEnemiesRespawn();
      newEnemies.forEach(enemy => enemies.push(new Enemy(enemy.x, enemy.y, respawn.enemy.size, respawn.enemy.size)));
    }
  }

  // Move enemies
  enemies.forEach((enemy, i, arr) => {
    enemy.move(getShortestStep(enemy, player, [...enemies, ...background.borders]));
    if (checkCollision(enemy, player) && !player.transparency) {
      lifes--;
      player.transparency = true;
      setTimeout(() => player.transparency = false, 2000)
      if (lifes > 0) {
        arr.splice(i, 1);
      }
    }
  });
}

function draw() {
  clearCanvas();
  background.draw(ctx, score, lifes, ammunition, timeLimit);
  player.draw(ctx);
  if (currentAmmunition) drawAmmunition();
  if (currentTimer) drawTimer();
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
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

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

function getEnemiesRespawn() {
  let options = [
    {x: 340, y: 0}, {x: 380, y: 0}, {x: 420, y: 0},
    {x: 660, y: 240}, {x: 660, y: 280}, {x: 660, y: 320},
    {x: 340, y: 560}, {x: 380, y: 560}, {x: 420, y: 560},
    {x: 100, y: 240}, {x: 100, y: 280}, {x: 100, y: 320}
  ];
  options.sort(() => Math.random() - 0.5);
  let random = getRandomNumber(respawn.enemy.quantity.min, respawn.enemy.quantity.max);
  let selected = [];
  for (let i = 0; i < random; i++) {
    if (!enemies.some(enemy => checkCollision(options[i], enemy))) {
      selected.push(options[i]);
    } else {
      i--;
    }
  }
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

function getSupply(lastSuply) {
  let newSupply;
  do {
    newSupply = {
      x: (getRandomNumber(2, 13) * 40) + 100,
      y: getRandomNumber(2, 13) * 40,
      radius: 20
    }
  } while (newSupply === lastSuply || bulletCollision(newSupply, player))
  return newSupply;
}

function drawAmmunition() {
  ctx.beginPath();
  ctx.arc(currentAmmunition.x, currentAmmunition.y, currentAmmunition.radius, 0, 2 * Math.PI);
  ctx.fillStyle = 'gold';
  ctx.fill();
}

function drawTimer() {
  ctx.beginPath();
  ctx.fillStyle = "blue";
  ctx.moveTo(currentTimer.x - 20, currentTimer.y - 20);
  ctx.lineTo(currentTimer.x + 20, currentTimer.y - 20);
  ctx.lineTo(currentTimer.x, currentTimer.y + 10);
  ctx.closePath();
  ctx.fill();
}

function checkDifficulty() {
  switch (score) {
    case 5:
      respawn.enemy.quantity.min = 2;
      respawn.enemy.quantity.max = 2;
      break;
    case 6:
      respawn.enemy.quantity.min = 1;
      break;
    case 15:
      respawn.enemy.quantity.max = 3;
      break;
    case 25:
      respawn.enemy.time.min = 1750;
      respawn.enemy.time.max = 3500;
      break;
    case 50:
      respawn.enemy.time.min = 1500;
      respawn.enemy.time.max = 5000;
      break;
    case 75:
      respawn.enemy.time.min = 1250;
      respawn.enemy.time.max = 7000;
      respawn.ammunition.time.min = 1000;
      respawn.ammunition.time.max = 5000;
      break;
    case 90:
      respawn.enemy.time.min = 2000;
      respawn.enemy.time.max = 5000;
      respawn.ammunition.time.min = 500;
      respawn.ammunition.time.max = 2500;
      break;
    case 100:
      respawn.enemy.time.min = 5000;
      respawn.enemy.time.max = 5000;
      respawn.enemy.quantity.min = 6;
      respawn.enemy.quantity.max = 6;
      break;
    case 125:
      respawn.enemy.time.min = 2500;
      respawn.enemy.time.max = 3500;
      respawn.enemy.quantity.min = 1;
      respawn.enemy.quantity.max = 3;
      respawn.ammunition.time.min = 2500;
      respawn.ammunition.time.max = 5000;
      break;
    case 150:
      respawn.enemy.time.min = 1250;
      respawn.enemy.time.max = 7000;
      respawn.enemy.quantity.max = 4;
      respawn.ammunition.time.min = 1000;
      respawn.ammunition.time.max = 3000;
      break;
    case 175:
      respawn.enemy.time.min = 1000;
      respawn.enemy.time.max = 8000;
      respawn.ammunition.time.min = 500;
      respawn.ammunition.time.max = 2500;
      break;
    case 200:
      respawn.enemy.time.min = 750;
      respawn.enemy.time.max = 9000;
      break;
    case 1000:
      respawn.enemy.quantity.max = 2;
      respawn.enemy.quantity.max = 5;
      respawn.enemy.size = 20;
      break;
  }
}
