export default class Player {
  constructor() {
    this.color = "darkgreen";
    this.size = 40;
    this.velocity = 5;
    this.x = 380;
    this.y = 280;
  }

  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }
}