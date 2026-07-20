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

function Fruit() {
  this.x;
  this.y;
  // Assign the fruit class the position X and Y in this init method
  this.pickLocation = function() {
    this.x = Math.floor(Math.random() * 17 + 1) * scale;
    this.y = Math.floor(Math.random() * 15 + 3) * scale;

    if (this.x == snake.x && this.y == snake.y) {
      this.x = Math.floor(Math.random() * 17 + 1) * scale;
      this.y = Math.floor(Math.random() * 15 + 3) * scale;
    }
  };

  this.draw = function() {
    // Draw beautiful glowing neon rose fruit
    context.shadowBlur = 12;
    context.shadowColor = '#f43f5e';
    context.fillStyle = '#f43f5e';

    drawRoundedRect(context, this.x + 4, this.y + 4, scale - 8, scale - 8, 4);

    context.shadowBlur = 0;
  };
}
