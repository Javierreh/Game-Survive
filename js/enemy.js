export default class Enemy {
  constructor(x, y, width, height) {
    this.color = 'red';
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocity = 2;
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
