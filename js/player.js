import Bullet from './bullet.js';
export default class Player {
  constructor() {
    this.color = "darkgreen";
    this.width = 40;
    this.height = 40;
    this.velocity = 3;
    this.x = 380;
    this.y = 280;
    this.shootVelocity = 5;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move(keys, background) {
    let dx = 0;
    let dy = 0;
    if (keys.up) dy = -this.velocity; 
    if (keys.down) dy = this.velocity;
    if (keys.left) dx = -this.velocity;
    if (keys.right) dx = this.velocity;
    if (dx !== 0 && dy !== 0) {
      this.x += dx / 1.5;
      this.y += dy / 1.5;
    }
    else if (dx !== 0 || dy !== 0) {
      this.x += dx;
      this.y += dy;
    }
    this.limitPosition(background);
  }

  limitPosition(background) {
    if (this.x < background.x + background.sizeElement) {
      this.x = background.x + background.sizeElement;
    }
    if (this.x > (background.x + background.sizeArea) - background.sizeElement * 2) {
      this.x = (background.x + background.sizeArea) - background.sizeElement * 2;
    }
    if (this.y < background.y + background.sizeElement) {
      this.y = background.y + background.sizeElement;
    }
    if (this.y > (background.y + background.sizeArea) - background.sizeElement * 2) {
      this.y = (background.y + background.sizeArea) - background.sizeElement * 2;
    }
  }

  shoot(keys) {
    let dx = 0;
    let dy = 0;
    if (keys.shootUp) dy = -this.shootVelocity;
    if (keys.shootDown) dy = this.shootVelocity;
    if (keys.shootLeft) dx = -this.shootVelocity;
    if (keys.shootRight) dx = this.shootVelocity;
    if (dx !== 0 && dy !== 0) return this.createBullet(dx / 1.5, dy / 1.5);
    else if (dx !== 0 || dy !== 0) return this.createBullet(dx, dy);
  }

  createBullet(dx, dy) {
    return new Bullet(
      this.x + this.width / 2,
      this.y + this.height / 2,
      dx,
      dy
    );
  }
}
