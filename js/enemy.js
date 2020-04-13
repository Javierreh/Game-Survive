export default class Enemy {
  constructor(x, y) {
    this.color = 'red';
    this.size = 40;
    this.x = x;
    this.y = y;
    this.velocity = 5;
  }
  
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}