export default class Background {
  constructor() {
    this.color1 = 'black';
    this.color2 = '#DDDDDD';
    this.sizeArea = 600;
    this.sizeElement = 40;
    this.x = 100;
    this.y = 0;
    this.borders = [
      {x: this.x, y: this.y, xSize: this.sizeElement * 6, ySize: this.sizeElement},
      {x: this.x + this.sizeElement * 9, y: this.y, xSize: this.sizeElement * 6, ySize: this.sizeElement},
      {x: this.x, y: this.y + this.sizeArea - this.sizeElement, xSize: this.sizeElement * 6, ySize: this.sizeElement},
      {x: this.x + this.sizeElement * 9, y: this.y + this.sizeArea - this.sizeElement, xSize: this.sizeElement * 6, ySize: this.sizeElement},
      {x: this.x, y: this.y, xSize: this.sizeElement, ySize: this.sizeElement * 6},
      {x: this.x, y: this.y + this.sizeElement * 9, xSize: this.sizeElement, ySize: this.sizeElement * 6},
      {x: this.x + this.sizeArea - this.sizeElement, y: this.y, xSize: this.sizeElement, ySize: this.sizeElement * 6},
      {x: this.x + this.sizeArea - this.sizeElement, y: this.y + this.sizeElement * 9, xSize: this.sizeElement, ySize: this.sizeElement * 6}
    ];
    this.respawns = [
      {x: this.x + (this.sizeArea * 0.4), y: this.y, xSize: this.sizeElement * 3, ySize: this.sizeElement},
      {x: this.x + (this.sizeArea * 0.4), y: this.y + this.sizeArea, xSize: this.sizeElement * 3, ySize: -this.sizeElement},
      {x: this.x, y: this.y + (this.sizeArea * 0.4), xSize: this.sizeElement, ySize: this.sizeElement * 3},
      {x: this.x + this.sizeArea, y: this.y + (this.sizeArea * 0.4), xSize: -this.sizeElement, ySize: this.sizeElement * 3}
    ];
  }
  
  draw(ctx) {
    // Draw Game Area
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.sizeArea, this.sizeArea);
    ctx.strokeStyle = this.color1;
    ctx.stroke();

    // Draw background borders
    ctx.fillStyle = this.color1;
    this.borders.forEach(border => ctx.fillRect(border.x, border.y, border.xSize, border.ySize));

    // Draw enemies respawn area
    ctx.fillStyle = this.color2;
    this.respawns.forEach(respawn => ctx.fillRect(respawn.x, respawn.y, respawn.xSize, respawn.ySize));
  }
}
