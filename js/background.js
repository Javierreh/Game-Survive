export default class Background {
  constructor() {
    this.color1 = 'black';
    this.color2 = '#DDDDDD';
    this.sizeArea = 600;
    this.sizeElement = 40;
    this.x = 100;
    this.y = 0;
    this.borders = [
      {x: this.x, y: this.y, width: this.sizeElement * 6, height: this.sizeElement},
      {x: this.x + this.sizeElement * 9, y: this.y, width: this.sizeElement * 6, height: this.sizeElement},
      {x: this.x, y: this.y + this.sizeArea - this.sizeElement, width: this.sizeElement * 6, height: this.sizeElement},
      {x: this.x + this.sizeElement * 9, y: this.y + this.sizeArea - this.sizeElement, width: this.sizeElement * 6, height: this.sizeElement},
      {x: this.x, y: this.y, width: this.sizeElement, height: this.sizeElement * 6},
      {x: this.x, y: this.y + this.sizeElement * 9, width: this.sizeElement, height: this.sizeElement * 6},
      {x: this.x + this.sizeArea - this.sizeElement, y: this.y, width: this.sizeElement, height: this.sizeElement * 6},
      {x: this.x + this.sizeArea - this.sizeElement, y: this.y + this.sizeElement * 9, width: this.sizeElement, height: this.sizeElement * 6}
    ];
    this.respawns = [
      {x: this.x + (this.sizeArea * 0.4), y: this.y, width: this.sizeElement * 3, height: this.sizeElement},
      {x: this.x + (this.sizeArea * 0.4), y: this.y + this.sizeArea - this.sizeElement, width: this.sizeElement * 3, height: this.sizeElement},
      {x: this.x, y: this.y + (this.sizeArea * 0.4), width: this.sizeElement, height: this.sizeElement * 3},
      {x: this.x + this.sizeArea - this.sizeElement, y: this.y + (this.sizeArea * 0.4), width: this.sizeElement, height: this.sizeElement * 3}
    ];
  }
  
  draw(ctx, score, lifes) {
    // Draw Game Area
    ctx.beginPath();
    ctx.rect(this.x, this.y, this.sizeArea, this.sizeArea);
    ctx.strokeStyle = this.color1;
    ctx.stroke();

    // Draw background borders
    ctx.fillStyle = this.color1;
    this.borders.forEach(border => ctx.fillRect(border.x, border.y, border.width, border.height));

    // Draw enemies respawn area
    ctx.fillStyle = this.color2;
    this.respawns.forEach(respawn => ctx.fillRect(respawn.x, respawn.y, respawn.width, respawn.height));

    // Draw score
    ctx.fillStyle = 'red';
    ctx.fillRect(730, 51, 40, 40);
    ctx.fillStyle = 'black';
    ctx.font = '30px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(score, 750, 125);
    
    // Draw lifes
    ctx.fillStyle = 'darkgreen';
    let lifePositionY = 510;
    for (let i = 0; i < lifes; i++) {
      ctx.fillRect(30, lifePositionY, 40, 40);
      lifePositionY -= 51;
    }
  }
}
