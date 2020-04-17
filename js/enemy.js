export default class Enemy {
  constructor(x, y) {
    this.color = 'red';
    this.x = x;
    this.y = y;
    this.width = 40;
    this.height = 40;
    this.velocity = 3;
  }
  
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }

  move(nextStep) {
    if (nextStep !== undefined) {
      this.x = nextStep.x;
      this.y = nextStep.y;
    }
  }
}
