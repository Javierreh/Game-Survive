export default class Enemy {
  constructor(x, y) {
    this.color = 'red';
    this.size = 40;
    this.x = x;
    this.y = y;
    this.velocity = 3;
  }
  
  draw(ctx) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.size, this.size);
  }

  move(enemies, player) {
    const shortestPath = this.getShortestPath(enemies, player);
    if (shortestPath !== undefined) {
      this.x = shortestPath.x;
      this.y = shortestPath.y;
    }

  }

  getShortestPath(enemies, player) {
    const grid = [
      {x: this.x, y: this.y - this.velocity},
      {x: this.x + this.velocity, y: this.y},
      {x: this.x, y: this.y + this.velocity},
      {x: this.x - this.velocity, y: this.y}
    ];

    // Comprobar cuales están accesible
    let available = grid.filter(spot => {
      return !enemies.some(enemy => {
        return  spot.x >= enemy.x - 40 && spot.x <= enemy.x + 40 &&
                spot.y >= enemy.y - 40 && spot.y <= enemy.y + 40 && enemy !== this;      
      });
    });

    // Si hay alguna accesible, calcular las distancias y seleccionar la menor hasta player
    if (available.length > 0) {
      let distances = available.map(elem => this.dist(elem.x, elem.y, player.x, player.y));
      let indexSelected = distances.indexOf(Math.min(...distances));
      let minPath = available[indexSelected];
      return minPath
    }
  }

  dist(x1, y1, x2, y2) {
    let a = x1 - x2;
    let b = y1 - y2;
    let result = Math.sqrt(a*a + b*b);
    return result;
  }

}
