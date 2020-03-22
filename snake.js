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


class Snake {
  constructor(x, y, worldX, worldY) {
    this._world = {
      x: worldX,
      y: worldY
    };
    this._snake = [
      {
        x: x,
        y: y
      },
      {
        x: x - 1,
        y: y
      }
    ];
  }

}
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
  this.draw = function() {
    context.fillStyle = '#58D68D';
    context.strokeStyle = 'white';

    for (let i = 0; i < this.tail.length; i++) {
      context.beginPath();
      context.arc(this.tail[i].x + 16, this.tail[i].y + 16, 15, 0, 2 * Math.PI);
      context.fill();
      context.stroke();
    }

    context.beginPath();
    context.arc(this.x + 16, this.y + 16, 15, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
  };

  this.update = function() {
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

  this.changeDirection = function(direction) {
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

  this.agentMoveSnake = function(direction) {
    if (this.lastDirection != direction) {
      this.changeDirection(direction);
    }
  };

  this.toggleButtons = function(direction) {
    switch (direction) {
      case 79: // O
        this.toggleSound = !this.toggleSound;
        let soundEmoji = this.toggleSound
          ? String.fromCodePoint(0x1f508)
          : String.fromCodePoint(0x1f507);
        document.getElementById('sound-btn').innerText = soundEmoji;
        this.toggleSound ? PAUSEDSOUND.play() : PAUSEDSOUND.pause();
      case 80: // P
        this.paused = !this.paused; // Opposite value
        this.toggleSound = !this.toggleSound;
    }
  };

  this.eat = function(fruit) {
    if (this.x === fruit.x && this.y === fruit.y) {
      this.total++;
      this.toggleSound ? EAT.play() : EAT.pause();
      return true;
    }
    return false;
  };

  this.checkCollision = function() {
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

  this.collisionDetected = function() {
    this.gameOver = true;
    this.paused = true;
    this.toggleSound ? DEAD.play() : DEAD.pause();
    snake.reset();
  };

  this.reset = function() {
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
  this.getDistanceToFruit = function() {
    let x = this.tail[this.tail.length - 1].x - fruit.x;
    let y = this.tail[this.tail.length - 1].y - fruit.y;
    console.log(x, y);
    return Math.sqrt(x * x + y * y);
  };

  this.getAngleToFruit = function() {
    let deltaX = this.x - fruit.x;
    let deltaY = this.y - fruit.y;
    return (Math.atan2(deltaY, deltaX) * 180) / PI;
  };
} // Class end
