const LEFTSOUND = new Audio('audio/left.mp3');
const UPSOUND = new Audio('audio/up.mp3');
const RIGHTSOUND = new Audio('audio/right.mp3');
const DOWNSOUND = new Audio('audio/down.mp3');
const PAUSED = new Audio('audio/paused.ogg');
const EAT = new Audio('audio/eat.mp3');
const DEAD = new Audio('audio/dead.mp3');

const UP = 0;
const RIGHT = 1;
const DOWN = 2;
const LEFT = 3;

function Snake() {
  this.x = scale;
  this.y = scale * 3;
  this.xSpeed = scale * 1;
  this.ySpeed = 0;
  this.total = 0;
  this.tail = [];
  this.paused = false;
  this.gameOver = false;
  this.lastDirection = -1;
  this.toggleSound = false;

  // Context is getting the context from the 2D canvas
  this.draw = function () {
    // Glow effect
    context.shadowBlur = 10;
    
    // Draw tail
    for (let i = 0; i < this.tail.length; i++) {
      // Calculate fade ratio
      let ratio = (i + 1) / (this.tail.length + 1);
      context.fillStyle = `rgba(0, 242, 254, ${0.35 + 0.65 * ratio})`;
      context.shadowColor = '#00f2fe';
      drawRoundedRect(context, this.tail[i].x + 2, this.tail[i].y + 2, scale - 4, scale - 4, 6);
    }

    // Draw head
    context.fillStyle = '#3b82f6';
    context.shadowColor = '#3b82f6';
    drawRoundedRect(context, this.x + 2, this.y + 2, scale - 4, scale - 4, 8);
    
    // Reset shadow
    context.shadowBlur = 0;
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
        this.toggleSound ? LEFTSOUND.play() : LEFTSOUND.pause();
        this.xSpeed = -scale * 1;
        this.ySpeed = 0;
        break;
      case UP: // UP
        this.toggleSound ? UPSOUND.play() : UPSOUND.pause();
        this.xSpeed = 0;
        this.ySpeed = -scale * 1;
        break;
      case RIGHT: // RIGHT
        this.toggleSound ? RIGHTSOUND.play() : RIGHTSOUND.pause();
        this.xSpeed = scale * 1;
        this.ySpeed = 0;
        break;
      case DOWN: // DOWN
        this.toggleSound ? DOWNSOUND.play() : DOWNSOUND.pause();
        this.xSpeed = 0;
        this.ySpeed = scale * 1;
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
      case 79: // O = audio
        this.toggleSound = !this.toggleSound;
        let soundEmoji = this.toggleSound
          ? String.fromCodePoint(0x1f508)
          : String.fromCodePoint(0x1f507);
        document.getElementById('sound-btn').innerText = soundEmoji;
        this.toggleSound ? PAUSEDSOUND.play() : PAUSEDSOUND.pause();
      case 80: // P = pause
        this.paused = !this.paused;
        this.toggleSound = !this.toggleSound;
    }
  };

  this.eat = function (fruit) {
    if (this.x === fruit.x && this.y === fruit.y) {
      this.total++;
      this.toggleSound ? EAT.play() : EAT.pause();
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
      this.x >= canvas.width ||
      this.y >= canvas.height ||
      this.x < 0 ||
      this.y < scale * 2
    ) {
      this.collisionDetected();
      return true;
    }
    return false;
  };

  this.collisionDetected = function () {
    this.gameOver = true;
    this.paused = true;
    this.toggleSound ? DEAD.play() : DEAD.pause();
    snake.reset();
  };

  this.reset = function () {
    this.total = 0;
    this.tail = [];
    this.x = 32;
    this.y = scale * 3;
    this.xSpeed = scale * 1;
    this.ySpeed = 0;
    this.paused = false;
    this.gameOver = false;
    this.lastDirection = -1;
    fruit.pickLocation();
  };

  // AI:
  this.getDistanceToFruit = function () {
    let deltaX = this.x - fruit.x;
    let deltaY = this.y - fruit.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  };

  this.getAngleToFruit = function () {
    let deltaX = this.x - fruit.x;
    let deltaY = this.y - fruit.y;
    return (Math.atan2(deltaY, deltaX) * 180) / PI;
  };

  this.getObstacles = function () {
    let obstacles = [0, 0, 0, 0]; // up, right, down, left
    // Up
    if (this.y - scale < scale * 2 || this.isTail(this.x, this.y - scale)) obstacles[0] = 1;
    // Right
    if (this.x + scale >= canvas.width || this.isTail(this.x + scale, this.y)) obstacles[1] = 1;
    // Down
    if (this.y + scale >= canvas.height || this.isTail(this.x, this.y + scale)) obstacles[2] = 1;
    // Left
    if (this.x - scale < 0 || this.isTail(this.x - scale, this.y)) obstacles[3] = 1;
    return obstacles;
  };

  this.isTail = function (x, y) {
    for (let i = 0; i < this.tail.length; i++) {
      if (x === this.tail[i].x && y === this.tail[i].y) return true;
    }
    return false;
  };
} // Class end
