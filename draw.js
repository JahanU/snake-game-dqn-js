let miniGame;
let largeGame;

let spec = {
  update: 'qlearn',
  gamma: 0.9,
  epsilon: 0.02,
  alpha: 0.005,
  experience_add_every: 5,
  tderror_clamp: 1.0,
  num_hidden_units: 100
};

class GameInstance {
  constructor(canvasId, scale, spec, metricPrefix, highscoreKey) {
    this.canvas = document.getElementById(canvasId);
    this.context = this.canvas.getContext('2d');
    this.scale = scale;
    this.rows = this.canvas.height / scale;
    this.columns = this.canvas.width / scale;
    
    this.snake = new Snake(this.canvas, this.context, this.scale);
    this.fruit = new Fruit(this.canvas, this.context, this.scale, this.snake);
    this.snake.fruit = this.fruit; // Bind fruit to snake
    
    this.agent = new Agent(spec, this.snake, this.fruit, this.canvas, metricPrefix, highscoreKey);
    this.fruit.pickLocation();
  }
  
  update() {
    // Draw sleek dark slate board
    this.context.fillStyle = '#0f172a';
    this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw grid checkered squares
    for (let r = 2; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        if ((r + c) % 2 === 0) {
          this.context.fillStyle = '#0b0f19';
          this.context.fillRect(c * this.scale, r * this.scale, this.scale, this.scale);
        }
      }
    }

    this.fruit.draw();
    this.snake.draw();
    
    let displayScore =
      'Score: ' + this.snake.total + '  |  Record: ' + Math.max(this.snake.total, localStorage[this.agent.highscoreKey] || 0);

    if (this.snake.paused == false) {
      this.snake.update(); // Update frame
      this.showTitle(displayScore);
      this.agent.trainAgent();
      this.agent.showAgentStats();
      this.highestScore();
    } else {
      this.onPaused();
    }
  }
  
  showTitle(displayScore) {
    this.context.fillStyle = '#1e293b'; 
    this.context.fillRect(0, 0, this.canvas.width, this.scale * 2);

    this.context.strokeStyle = 'rgba(59, 130, 246, 0.4)';
    this.context.lineWidth = 1;
    this.context.beginPath();
    this.context.moveTo(0, this.scale * 2);
    this.context.lineTo(this.canvas.width, this.scale * 2);
    this.context.stroke();

    this.context.fillStyle = '#38bdf8'; 
    this.context.font = 'bold 12px "Inter", sans-serif'; 
    this.context.fillText("SNAKE DQN AI", 12, this.scale + 4);

    this.context.fillStyle = '#e2e8f0'; 
    this.context.font = '10px "Inter", sans-serif';
    this.context.textAlign = 'right';
    this.context.fillText(displayScore, this.canvas.width - 12, this.scale + 4);
    this.context.textAlign = 'left';
  }
  
  highestScore() {
    let currentHigh = parseInt(localStorage[this.agent.highscoreKey] || 0);
    if (this.snake.total > currentHigh) {
      localStorage[this.agent.highscoreKey] = this.snake.total;
    }
  }
  
  onPaused() {
    if (!this.snake.gameOver) {
      let displayScore =
        'Score: ' + this.snake.total + '  |  Record: ' + Math.max(this.snake.total, localStorage[this.agent.highscoreKey] || 0);
      this.showTitle(displayScore);
      
      this.context.fillStyle = 'yellow';
      this.context.strokeStyle = 'black';
      this.context.font = '30px sans-serif';
      this.context.textAlign = 'center';
      this.context.fillText('Paused', this.canvas.width / 2, this.canvas.height / 1.75);
      this.context.strokeText('Paused', this.canvas.width / 2, this.canvas.height / 1.75);
      this.context.textAlign = 'left';
    }
  }
}

// Init function, setup objects
function setup() {
  miniGame = new GameInstance('gameCanvasMini', 32, spec, 'mini', 'highestScoreKeyMini');
  largeGame = new GameInstance('gameCanvasLarge', 32, spec, 'large', 'highestScoreKeyLarge');
}

// Runs game // MAIN
function updateGame() {
  if (miniGame && largeGame) {
    miniGame.update();
    largeGame.update();
  }
}

let gameInterval;
let gameSpeed = 20; // Default speed in ms

function setGameSpeed(newSpeed) {
  gameSpeed = newSpeed;
  document.getElementById('speedVal').innerText = gameSpeed;
  if (gameInterval) {
    clearInterval(gameInterval);
  }
  gameInterval = setInterval(updateGame, gameSpeed);
}

// Listen to slider changes to dynamically update speed
document.getElementById('speedSlider').addEventListener('input', function (e) {
  setGameSpeed(parseInt(e.target.value));
});

// Start the game loop
setGameSpeed(gameSpeed);

document.onkeydown = function (event) {
  if (event.keyCode === 80) { // P = pause both
    if (miniGame && largeGame) {
      miniGame.snake.paused = !miniGame.snake.paused;
      largeGame.snake.paused = !largeGame.snake.paused;
    }
  }
};
