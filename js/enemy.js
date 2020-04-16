export default class Enemy {
  constructor(x, y) {
    this.color = 'red';
    this.x = x;
    this.y = y;
    this.xSize = 40;
    this.ySize = 40;
    this.velocity = 3;
  }
  
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.xSize, this.ySize);
  }

  move(nextStep) {
    if (nextStep !== undefined) {
      this.x = nextStep.x;
      this.y = nextStep.y;
    }
  }
}
