  // Initalise sounds:
  function Snake() {
    this.x = 32;
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
      context.fillStyle = '#58D68D';
      context.strokeStyle = 'white';

      for (let i = 0; i < this.tail.length; i++) {
        context.beginPath();
        context.arc(this.tail[i].x + 16, this.tail[i].y + 16, 15, 0, 2 * Math.PI);
        context.fill()
        context.stroke();
      }

      context.beginPath();
      context.arc(this.x + 16, this.y + 16, 15, 0, 2 * Math.PI);
      context.fill()
      context.stroke();
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
      var paused = new Audio('audio/paused.ogg');
      var left = new Audio('audio/left.mp3');
      var up = new Audio('audio/up.mp3');
      var right = new Audio('audio/right.mp3');
      var down = new Audio('audio/down.mp3');
      // Convert keyboard action to number
      switch (direction) {
        case 37: // LEFT
          this.toggleSound ? left.play() : left.pause();
          this.xSpeed = -scale * 1;
          this.ySpeed = 0;
          break;
        case 38: // UP
          this.toggleSound ? up.play() : up.pause();
          this.xSpeed = 0;
          this.ySpeed = -scale * 1;
          break;
        case 39: // RIGHT
          this.toggleSound ? right.play() : right.pause();
          this.xSpeed = scale * 1;
          this.ySpeed = 0;
          break;
        case 40: // DOWN
          this.toggleSound ? down.play() : down.pause();
          this.xSpeed = 0;
          this.ySpeed = scale * 1;
          break;
        case 80:
          this.paused = !this.paused; // Opposite value
          if (this.paused == false) {
            this.changeDirection(this.lastDirecption);
            break;
          }
          case 81:
            this.toggleSound = !this.toggleSound
            let soundEmoji = (this.toggleSound) ? String.fromCodePoint(0x1F508) : String.fromCodePoint(0x1F507);
            document.getElementById("sound-btn").innerText = soundEmoji
            this.toggleSound ? paused.play() : paused.pause();
      }
    };


    this.eat = function (fruit) {
      if (this.x === fruit.x && this.y === fruit.y) {
        this.total++;
        var eat = new Audio('audio/eat.mp3');
        this.toggleSound ? eat.play() : eat.pause();
        return true;
      }
      return false;
    };


    this.checkCollision = function () {
      for (var i = 0; i < this.tail.length; i++) {
        if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
          this.collisionDetected();
        }
      }
      if (this.x >= canvas.width || this.y >= canvas.height || this.x < 0 || this.y < scale * 2) {
        this.collisionDetected();
      }
    };

    this.collisionDetected = function () {
      this.gameOver = true;
      this.paused = true;
      var dead = new Audio('audio/dead.mp3');
      this.toggleSound ? dead.play() : dead.pause();


      setTimeout(function () {
        snake.reset();
      }, 1000);
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





  } // Class end