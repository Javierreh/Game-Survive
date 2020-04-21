export default class Enemy {
  constructor(x, y, width, height, velocity) {
    this.color = 'red';
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocity = velocity;
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
