
const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

function Snake(canvas, context, scale) {
  this.canvas = canvas;
  this.context = context;
  this.scale = scale;
  this.fruit = null; // Bound during setup
  
  this.x = this.scale;
  this.y = this.scale * 3;
  this.xSpeed = this.scale * 1;
  this.ySpeed = 0;
  this.total = 0;
  this.tail = [];
  this.paused = false;
  this.gameOver = false;
  this.lastDirection = -1;

  // Context is getting the context from the 2D canvas
  this.draw = function () {
    // Glow effect
    this.context.shadowBlur = 10;
    
    // Draw tail
    for (let i = 0; i < this.tail.length; i++) {
      // Calculate fade ratio
      let ratio = (i + 1) / (this.tail.length + 1);
      this.context.fillStyle = `rgba(0, 242, 254, ${0.35 + 0.65 * ratio})`;
      this.context.shadowColor = '#00f2fe';
      drawRoundedRect(this.context, this.tail[i].x + 2, this.tail[i].y + 2, this.scale - 4, this.scale - 4, 6);
    }

    // Draw head
    this.context.fillStyle = '#3b82f6';
    this.context.shadowColor = '#3b82f6';
    drawRoundedRect(this.context, this.x + 2, this.y + 2, this.scale - 4, this.scale - 4, 8);
    
    // Reset shadow
    this.context.shadowBlur = 0;
  };

  this.update = function () {
    for (let i = 0; i < this.tail.length - 1; i++) {
      this.tail[i] = this.tail[i + 1];
    }

    this.tail[this.total - 1] = {
      x: this.x,
      y: this.y
    };
    this.x += this.xSpeed;
    this.y += this.ySpeed;
  };

  this.changeDirection = function (direction) {
    this.lastDirection = direction;
    // Convert keyboard action to number
    switch (direction) {
      case LEFT: // LEFT
        this.xSpeed = -this.scale * 1;
        this.ySpeed = 0;
        break;
      case UP: // UP
        this.xSpeed = 0;
        this.ySpeed = -this.scale * 1;
        break;
      case RIGHT: // RIGHT
        this.xSpeed = this.scale * 1;
        this.ySpeed = 0;
        break;
      case DOWN: // DOWN
        this.xSpeed = 0;
        this.ySpeed = this.scale * 1;
        break;
    }
  };

  this.agentMoveSnake = function (direction) {
    if (this.lastDirection != direction) {
      this.changeDirection(direction);
    }
  };

  this.toggleButtons = function (direction) {
    switch (direction) {
      case 80: // P = pause
        this.paused = !this.paused;
        break;
    }
  };

  this.eat = function (fruit) {
    if (this.x === fruit.x && this.y === fruit.y) {
      this.total++;
      return true;
    }
    return false;
  };

  this.checkCollision = function () {
    for (var i = 0; i < this.tail.length; i++) {
      if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
        this.collisionDetected();
        return true;
      }
    }
    if (
      this.x >= this.canvas.width ||
      this.y >= this.canvas.height ||
      this.x < 0 ||
      this.y < this.scale * 2
    ) {
      this.collisionDetected();
      return true;
    }
    return false;
  };

  this.collisionDetected = function () {
    this.gameOver = true;
    this.paused = true;
    this.reset();
  };

  this.reset = function () {
    this.total = 0;
    this.tail = [];
    this.x = this.scale;
    this.y = this.scale * 3;
    this.xSpeed = this.scale * 1;
    this.ySpeed = 0;
    this.paused = false;
    this.gameOver = false;
    this.lastDirection = -1;
    if (this.fruit) {
      this.fruit.pickLocation();
    }
  };

  // AI:
  this.getDistanceToFruit = function () {
    let deltaX = this.x - this.fruit.x;
    let deltaY = this.y - this.fruit.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  };

  this.getAngleToFruit = function () {
    let deltaX = this.x - this.fruit.x;
    let deltaY = this.y - this.fruit.y;
    return (Math.atan2(deltaY, deltaX) * 180) / PI;
  };

  this.getObstacles = function () {
    let obstacles = [0, 0, 0, 0]; // up, right, down, left
    // Up
    if (this.y - this.scale < this.scale * 2 || this.isTail(this.x, this.y - this.scale)) obstacles[0] = 1;
    // Right
    if (this.x + this.scale >= this.canvas.width || this.isTail(this.x + this.scale, this.y)) obstacles[1] = 1;
    // Down
    if (this.y + this.scale >= this.canvas.height || this.isTail(this.x, this.y + this.scale)) obstacles[2] = 1;
    // Left
    if (this.x - this.scale < 0 || this.isTail(this.x - this.scale, this.y)) obstacles[3] = 1;
    return obstacles;
  };

  this.isTail = function (x, y) {
    for (let i = 0; i < this.tail.length; i++) {
      if (x === this.tail[i].x && y === this.tail[i].y) return true;
    }
    return false;
  };
} // Class end
