export default class Bullet {
  constructor(x, y, dx, dy) {
    this.color = 'gold';
    this.x = x;
    this.y = y;
    this.radius = 6.66;
    this.dx = dx;
    this.dy = dy;
  }

  draw(ctx) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  move() {
    this.x += this.dx;
    this.y += this.dy; 
  }
}
