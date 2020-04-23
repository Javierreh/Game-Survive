export default function checkDifficulty(score, respawn) {
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
      respawn.enemy.quantity.min = 5;
      respawn.enemy.quantity.max = 7;
      respawn.ammunition.time.min = 3500;
      respawn.ammunition.time.max = 4500;
      respawn.ammunition.quantity = 30;
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
      respawn.enemy.quantity.min = 9;
      respawn.enemy.quantity.max = 9;
      respawn.ammunition.time.min = 4000;
      respawn.ammunition.time.max = 5000;
      respawn.enemy.time.min = 2000;
      respawn.enemy.time.max = 2000;
      respawn.boom.time.min = 3500;
      respawn.boom.time.max = 4000;
      respawn.life.time.min = 3000;
      respawn.life.time.max = 4500;
      respawn.enemy.size = 25;
      respawn.enemy.velocity = 1.3;
      respawn.enemy.limit = 60
      break;
  }
}