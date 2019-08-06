function Fruit() {
  this.x;
  this.y;
  // Assign the fruit class the position X and Y in this init method
  this.pickLocation = function () {
    this.x = (Math.floor(Math.random() * columns)) * scale;
    this.y = (Math.floor(Math.random() * rows)) * scale;
  }

  this.draw = function () {
    // Draw fruit
    context.fillStyle = "#ACE3D0";
    context.fillRect(this.x, this.y, scale, scale)

    // extras
    context.lineWidth = 5;
    context.strokeStyle = "#33998C";
    context.strokeRect(0, 0, canvas.width, canvas.height); //for white background
  }
}