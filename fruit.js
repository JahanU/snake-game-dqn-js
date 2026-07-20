function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.fill();
}

function Fruit(canvas, context, scale, snake) {
  this.canvas = canvas;
  this.context = context;
  this.scale = scale;
  this.snake = snake;
  this.x;
  this.y;
  
  // Assign the fruit class the position X and Y in this init method
  this.pickLocation = function() {
    let columnsCount = this.canvas.width / this.scale;
    let rowsCount = this.canvas.height / this.scale;
    
    let minX = 1;
    let maxX = columnsCount - 2;
    this.x = Math.floor(Math.random() * (maxX - minX + 1) + minX) * this.scale;

    let minY = 3;
    let maxY = rowsCount - 2;
    this.y = Math.floor(Math.random() * (maxY - minY + 1) + minY) * this.scale;

    if (this.x == this.snake.x && this.y == this.snake.y) {
      this.pickLocation();
    }
  };

  this.draw = function() {
    // Draw beautiful glowing neon rose fruit
    this.context.shadowBlur = 12;
    this.context.shadowColor = '#f43f5e';
    this.context.fillStyle = '#f43f5e';

    drawRoundedRect(this.context, this.x + 4, this.y + 4, this.scale - 8, this.scale - 8, 4);

    this.context.shadowBlur = 0;
  };
}
