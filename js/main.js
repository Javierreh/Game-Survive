import Background from './background.js';
import Player from './player.js';
import Enemy from './enemy.js';
import checkDifficulty from './difficulty.js';
import { drawStartScreen, drawGameOverScreen } from './screens.js';
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const background = new Background();
const player = new Player();
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
let bullets, bulletLastDate, millisecodsBetweenShot, enemies;
let score, lifes, ammunition, timeLimit, oldTimeStamp;
let currentAmmunition, currentTimer, currentBoom, currentLife, respawn;
let startScreen, stoppedGame, statusGame;
resetGame();

window.requestAnimationFrame(gameLoop);

function gameLoop(timeStamp) {
  if (!startScreen) {
    if (!stoppedGame) {
      checkTimeStamp(timeStamp);
      update();
      draw();
    }
    if (statusGame) {
      clearCanvas();
      drawGameOverScreen(statusGame, background, ctx, score, lifes, ammunition, timeLimit);
    }
  } else {
    clearCanvas();
    drawStartScreen(background, ctx, score, lifes, ammunition, timeLimit);
  }
  window.requestAnimationFrame(gameLoop);
}

function update() {
  // Check game over
  if (lifes < 1 || timeLimit === 0) {
    stoppedGame = true;
    setTimeout(() => statusGame = 'lose', 1000);
  }
  if (score >= 1000) {
    stoppedGame = true;
    setTimeout(() => statusGame = 'win', 1000);
  }

  // Check difficulty
  checkDifficulty(score, respawn);

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
      checkDifficulty(score, respawn);
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
    if (checkLastDate(respawn.enemy.lastDate, getRandomNumber(respawn.enemy.time.min, respawn.enemy.time.max))) {
      respawn.enemy.lastDate = new Date();
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

function resetGame() {
  player.x = 380;
  player.y = 280;
  enemies = [];
  bullets = [];
  bulletLastDate = null;
  millisecodsBetweenShot = 250;
  score = 0;
  lifes = 10;
  ammunition = 25;
  timeLimit = 30;
  oldTimeStamp = null;
  currentAmmunition = null;
  currentTimer = null;
  currentBoom = null;
  currentLife = null;
  respawn = {
    enemy: {
      lastDate: null,
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
  }
  startScreen = true;
  stoppedGame = true;
  statusGame = null;
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
  if (event.keyCode === 32) {
    if (startScreen === true) {
      startScreen = false;
      stoppedGame = false;
    } 
    if (statusGame !== null) resetGame();
  } 
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
