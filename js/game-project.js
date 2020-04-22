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
let enemies = [];
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
let oldTimeStamp = null;

let currentAmmunition = null;
let currentTimer = null;
let currentBoom = null;
let currentLife = null;

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
    size: 40,
    velocity: 2,
    limit: 30
  },
  ammunition: {
    lastDate: null,
    time: {
      min: 4000,
      max: 9000
    },
    quantity: 10
  },
  timer: {
    lastDate: null,
    time: {
      min: 5000,
      max: 7000
    }
  },
  boom: {
    lastDate: null,
    time: {
      min: null,
      max: null
    }
  },
  life: {
    lastDate: null,
    time: {
      min: 12000,
      max: 12000
    }
  }
};

let startScreen = true;
let stoppedGame = false;

window.requestAnimationFrame(gameLoop);

function gameLoop(timeStamp) {
  if (!startScreen) {
    if (!stoppedGame) {
      checkTimeStamp(timeStamp);
      update();
      draw();
    }
  } else {
    clearCanvas();
    drawStartScreen();
  }
  window.requestAnimationFrame(gameLoop);
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
    currentAmmunition = getSupply('circle');
  }
  // Ammunition collision
  if (currentAmmunition && bulletCollision(currentAmmunition, player)) {
    currentAmmunition = null;
    respawn.ammunition.lastDate = new Date();
    ammunition += respawn.ammunition.quantity;
  }

  // Respawn Timer
  if (checkLastDate(respawn.timer.lastDate, getRandomNumber(respawn.timer.time.min, respawn.timer.time.max)) && !currentTimer) {
    currentTimer = getSupply('circle');
  }
  // Timer collision
  if (currentTimer && bulletCollision(currentTimer, player)) {
    currentTimer = null;
    respawn.timer.lastDate = new Date();
    timeLimit += 10;
    if (timeLimit > 30) timeLimit = 30;
  }

  // Respawn Boom
  if (checkLastDate(respawn.boom.lastDate, getRandomNumber(respawn.boom.time.min, respawn.boom.time.max)) && !currentBoom) {
    currentBoom = getSupply('circle');
  }
  // Boom collision
  if (currentBoom && bulletCollision(currentBoom, player)) {
    currentBoom = null;
    respawn.boom.lastDate = new Date();
    for (let i = 0; i < enemies.length; i++) {
      score++;
      checkDifficulty();
    }
    enemies = [];
  }

  // Respawn Life
  if (checkLastDate(respawn.life.lastDate, getRandomNumber(respawn.life.time.min, respawn.life.time.max)) && !currentLife && lifes < 10) {
    currentLife = getSupply('rect');
  }
  // Life collision
  if (currentLife && checkCollision(currentLife, player)) {
    currentLife = null;
    respawn.life.lastDate = new Date();
    lifes++;
    if (lifes > 10) lifes = 10;
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
  if (enemies.length < respawn.enemy.limit) {
    if (checkLastDate(lastEnemyDate, getRandomNumber(respawn.enemy.time.min, respawn.enemy.time.max))) {
      lastEnemyDate = new Date();
      const newEnemies = getEnemiesRespawn();
      newEnemies.forEach(enemy => enemies.push(new Enemy(enemy.x, enemy.y, respawn.enemy.size, respawn.enemy.size, respawn.enemy.velocity)));
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
  if (currentBoom) drawBoom();
  if (currentLife) drawLife();
  enemies.forEach(enemy => enemy.draw(ctx));
  bullets.forEach(bullet => bullet.draw(ctx));
}

function checkTimeStamp(timeStamp) {
  if (!oldTimeStamp) {
    oldTimeStamp = timeStamp;
    initRespawnDates();
  }
  timeLimit -= (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;
  if (timeLimit < 0) timeLimit = 0;
}

function initRespawnDates() {
  respawn.ammunition.lastDate = new Date();
  respawn.timer.lastDate = new Date();
  respawn.life.lastDate = new Date();
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
  if (event.keyCode === 32) startScreen = false; 
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
  if (currentDate - lastDate < milliseconds || milliseconds === null) {
    return false;
  }
  return true;
}

function getRandomNumber(min, max) {
  if (!min || !max) return null;
  return Math.round(Math.random() * (max - min) + min);
}

function getEnemiesRespawn() {
  let options = [
    {x: 340, y: 0, width: 40, height: 40}, {x: 380, y: 0, width: 40, height: 40}, {x: 420, y: 0, width: 40, height: 40},
    {x: 660, y: 240, width: 40, height: 40}, {x: 660, y: 280, width: 40, height: 40}, {x: 660, y: 320, width: 40, height: 40},
    {x: 340, y: 560, width: 40, height: 40}, {x: 380, y: 560, width: 40, height: 40}, {x: 420, y: 560, width: 40, height: 40},
    {x: 100, y: 240, width: 40, height: 40}, {x: 100, y: 280, width: 40, height: 40}, {x: 100, y: 320, width: 40, height: 40}
  ];
  options.sort(() => Math.random() - 0.5);
  let random = getRandomNumber(respawn.enemy.quantity.min, respawn.enemy.quantity.max);
  let selected = [];
  for (let i = 0; i < random; i++) {
    if (!enemies.some(enemy => checkCollision(options[i], enemy))) {
      selected.push(options[i]);
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

function getSupply(type) {
  let newSupply;
  if (type === 'circle') {
    do {
      newSupply = {
        x: (getRandomNumber(2, 13) * 40) + 100,
        y: getRandomNumber(2, 13) * 40,
        radius: 20
      }
    } while (bulletCollision(newSupply, player))
  } else if (type === 'rect') {
    do {
      newSupply = {
        x: (getRandomNumber(2, 13) * 40) + 100,
        y: getRandomNumber(2, 13) * 40,
        width: 30,
        height: 30
      }
    } while (checkCollision(newSupply, player))
  }
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
  ctx.fillStyle = 'blue';
  ctx.moveTo(currentTimer.x - 20, currentTimer.y - 20);
  ctx.lineTo(currentTimer.x + 20, currentTimer.y - 20);
  ctx.lineTo(currentTimer.x, currentTimer.y + 10);
  ctx.closePath();
  ctx.fill();
}

function drawBoom() {
  ctx.beginPath();
  ctx.fillStyle = 'black';
  ctx.moveTo(currentBoom.x, currentBoom.y - 20);
  ctx.lineTo(currentBoom.x - 20, currentBoom.y);
  ctx.lineTo(currentBoom.x, currentBoom.y + 20);
  ctx.lineTo(currentBoom.x + 20, currentBoom.y);
  ctx.closePath();
  ctx.fill();
}

function drawLife() {
  ctx.fillStyle = 'darkgreen';
  ctx.fillRect(currentLife.x, currentLife.y, currentLife.width, currentLife.height);
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
      respawn.boom.lastDate = new Date();
      respawn.boom.time.min = 6000;
      respawn.boom.time.max = 9000;
      break;
    case 75:
      respawn.enemy.time.min = 1250;
      respawn.enemy.time.max = 7000;
      respawn.ammunition.time.min = 4000;
      respawn.ammunition.time.max = 6000;
      break;
    case 90:
      respawn.enemy.time.min = 2000;
      respawn.enemy.time.max = 5000;
      respawn.boom.time.min = 12000;
      respawn.boom.time.max = 15000;
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
      respawn.boom.time.min = 6000;
      respawn.boom.time.max = 9000;
      break;
    case 150:
      respawn.enemy.time.min = 1500;
      respawn.enemy.time.max = 7000;
      respawn.enemy.quantity.max = 4;
      respawn.ammunition.time.min = 3000;
      respawn.ammunition.time.max = 4000;
      respawn.boom.time.min = 5000;
      respawn.boom.time.max = 7000;
      break;
    case 175:
      respawn.enemy.time.min = 1250;
      respawn.enemy.time.max = 8000;
      respawn.boom.time.min = 4000;
      respawn.boom.time.max = 6000;
      respawn.enemy.velocity = 1.8;
      break;
    case 200:
      respawn.enemy.time.min = 1000;
      respawn.enemy.time.max = 9000;
      respawn.enemy.quantity.max = 5;
      respawn.ammunition.time.min = 4000;
      respawn.ammunition.time.max = 5000;
      respawn.ammunition.quantity = 20;
      respawn.boom.time.min = 4000;
      respawn.boom.time.max = 6000;
      respawn.life.time.min = 6000;
      respawn.life.time.max = 6000;
      respawn.timer.time.min = 4000;
      respawn.timer.time.min = 5000;
      respawn.enemy.velocity = 1.6;
      break;
    case 500:
      respawn.enemy.time.min = 2000;
      respawn.enemy.time.max = 2000;
      respawn.enemy.quantity.min = 8;
      respawn.enemy.quantity.max = 8;
      respawn.ammunition.time.min = 3500;
      respawn.ammunition.time.max = 4500;
      respawn.boom.time.min = 8000;
      respawn.boom.time.max = 8000;
      respawn.life.time.min = 4000;
      respawn.life.time.max = 5500;
      respawn.timer.time.min = 3000;
      respawn.timer.time.min = 5000;
      respawn.enemy.size = 30;
      respawn.enemy.velocity = 1.4;
      respawn.enemy.limit = 45
      break;
    
    case 800:
      respawn.enemy.quantity.min = 12;
      respawn.enemy.quantity.max = 12;
      respawn.ammunition.time.min = 4000;
      respawn.ammunition.time.max = 5000;
      respawn.enemy.time.min = 1500;
      respawn.enemy.time.max = 1500;
      respawn.boom.time.min = 3000;
      respawn.boom.time.max = 4000;
      respawn.life.time.min = 5000;
      respawn.life.time.max = 6500;
      respawn.enemy.size = 20;
      respawn.enemy.velocity = 1.8;
      respawn.enemy.limit = 60
      break;
    case 1000:
      stoppedGame = true;
      // function youWin() here
      break;
  }
}

function drawStartScreen() {
  // Scene
  background.draw(ctx, score, lifes, ammunition, timeLimit);
  
  // Background
  ctx.shadowColor = 'black';
  ctx.shadowBlur = 5;
  ctx.shadowOffsetX = 2;
  ctx.shadowOffsetY = 2;
  ctx.fillStyle = 'lightgray';
  ctx.fillRect(175, 75, 450, 450);

  // Background title
  ctx.beginPath();
  ctx.ellipse(400, 145, 55, 175, Math.PI / 2, 0, 2 * Math.PI);
  ctx.fillStyle = '#03BDE8';
  ctx.fill();

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
  ctx.shadowBlur = 0;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
}
