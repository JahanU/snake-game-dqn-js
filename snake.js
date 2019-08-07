function Snake() {
  this.x = 0;
  this.y = 0;
  this.xSpeed = scale * 1;
  this.ySpeed = 0;
  this.total = 0;
  this.tail = []; // Tail is an array
  this.paused = false;
  this.gameOver = false;
  this.lastDirection = -1;


  // Context is getting the context from the 2D canvas
  this.draw = function () {
    context.fillStyle = '#DEE2E3';
    context.lineWidth = 1;
    context.strokeStyle = '#33988C';

    for (let i = 0; i < this.tail.length; i++) {
      context.lineWidth = 1;
      context.strokeStyle = '#33988C';
      context.strokeRect(this.tail[i].x, this.tail[i].y, scale, scale); //for white background
      context.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
    }
    context.fillRect(this.x, this.y, scale, scale);
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
    if (direction != 80) {
      this.lastDirection = direction;
    }
    // Convert keyboard action to number
    switch (direction) {
      case 37 || 'btnLeft': // LEFT
        this.xSpeed = -scale * 1;
        this.ySpeed = 0;
        break;
      case 38: // UP
        this.xSpeed = 0;
        this.ySpeed = -scale * 1;
        break;
      case 39: // RIGHT
        this.xSpeed = scale * 1;
        this.ySpeed = 0;
        break;
      case 40: // DOWN
        this.xSpeed = 0;
        this.ySpeed = scale * 1;
        break;
      case 80:
        this.paused = !this.paused; // Opposite value
        if (this.paused) {
          break;
        } else {
          this.changeDirection(this.lastDirection);
          break;
        }
    }
  };
  this.changeDirectionButtons = function (direction) {
    if (direction != 80) {
      this.lastDirection = direction;
    }

    // Convert keyboard action to number
    switch (direction) {
      case 37: // LEFT
        this.xSpeed = -scale * 1;
        this.ySpeed = 0;
        break;
      case 38: // UP
        this.xSpeed = 0;
        this.ySpeed = -scale * 1;
        break;
      case 39: // RIGHT
        this.xSpeed = scale * 1;
        this.ySpeed = 0;
        break;
      case 40: // DOWN
        this.xSpeed = 0;
        this.ySpeed = scale * 1;
        break;
      case 80:
        this.paused = !this.paused; // Opposite value
        if (this.paused) {
          break;
        } else {
          this.changeDirectionButtons(this.lastDirection);
          break;
        }
    }
  };

  this.eat = function (fruit) {
    if (this.x === fruit.x && this.y === fruit.y) {
      this.total++;
      return true;
    }
    return false;
  };

  this.reset = function () {
    this.total = 0;
    this.tail = [];
    this.x = 0;
    this.y = 0;
    this.xSpeed = scale * 1;
    this.ySpeed = 0;
    this.paused = false;
    this.gameOver = false;
    this.lastDirection = -1;
  };

  this.checkCollision = function () {
    for (var i = 0; i < this.tail.length; i++) {
      if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
        this.collisionDetected();
      }
    }
    if (
      this.x >= canvas.width ||
      this.y >= canvas.height ||
      this.x < 0 ||
      this.y < 0
    ) {
      this.collisionDetected();
    }
  };

  this.collisionDetected = function () {
    this.paused = true;
    this.gameOver = true;
    document.querySelector('.paused').innerText = 'Game over';
    setTimeout(function () {
      snake.reset();
    }, 1000);
  };
} // Class end