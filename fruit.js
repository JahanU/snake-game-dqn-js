function Fruit() {
  this.x;
  this.y;
  // Assign the fruit class the position X and Y in this init method
  this.pickLocation = function () {

    this.x = Math.floor(Math.random() * 17 + 1) * scale;
    this.y = Math.floor(Math.random() * 15 + 3) * scale;

    if (this.x == snake.x && this.y == snake.y) {
      this.x = Math.floor(Math.random() * 17 + 1) * scale;
      this.y = Math.floor(Math.random() * 15 + 3) * scale;
    }


  };

  this.draw = function () {
    // Draw fruit
    context.fillStyle = '#cc0000';
    context.strokeStyle = '#17202A';

    context.beginPath();
    context.arc(this.x + 16, this.y + 16, 15, 0, 2 * Math.PI);
    context.fill()
    context.stroke();
  };
}