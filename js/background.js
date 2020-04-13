export default class Background {
  constructor() {
    this.color1 = 'black';
    this.color2 = '#DDDDDD';
    this.size = 600;
    this.x = 100;
    this.y = 0;
    this.sizeElement = 40;
  }
  
  draw(ctx) {
    // Draw Game Area
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.size, this.size);
    ctx.strokeStyle = this.color1;
    ctx.stroke();

    // Draw background borders
    ctx.fillStyle = this.color1;
    ctx.fillRect(this.x, this.y, this.size, this.sizeElement);
    ctx.fillRect(this.x, this.size, this.size, -this.sizeElement);
    ctx.fillRect(this.x, this.y, this.sizeElement, this.size);
    ctx.fillRect(this.x + this.size, this.y, -this.sizeElement, this.size);

    // Draw enemies respawn area
    ctx.fillStyle = this.color2;
    ctx.fillRect(this.x  + (this.size * 0.4), 0, this.size * 0.2, this.sizeElement);
    ctx.fillRect(this.x  + (this.size * 0.4), this.size, this.size * 0.2, -this.sizeElement);
    ctx.fillRect(this.x, this.y + (this.size * 0.4), this.sizeElement, this.size * 0.2);
    ctx.fillRect(this.x + this.size, this.y + (this.size * 0.4), -this.sizeElement, this.size * 0.2);
  }
}
