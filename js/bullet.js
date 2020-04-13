export default class Bullet {
  constructor(x, y, velocity, dx, dy) {
    this.color = 'gold';
    this.size = 6.66;
    this.x = x;
    this.y = y;
    this.velocity = velocity;
    this.dx = dx;
    this.dy = dy;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  move() {
    this.x += this.dx;
    this.y += this.dy; 
  }

  remove(background) {
    if (this.x < background.x + background.sizeElement ||
        this.x > background.x + background.size - background.sizeElement ||
        this.y < background.y + background.sizeElement ||
        this.y > background.y + background.size - background.sizeElement) {
      return true;
    }
  }
}
