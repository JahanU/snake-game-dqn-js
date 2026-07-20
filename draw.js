const canvas = document.querySelector('.canvas'); // Get access to the canvas
const context = canvas.getContext('2d'); // Allows us to do 2D edits to the canvas (i.e draw on the canvas)
const scale = 32; // Size
const rows = canvas.height / scale;
const columns = canvas.width / scale;
let snake;
let fruit;
let brain;

// default values for the agent
let itt = 1;
let inputMode = 1; // 1
let neighboursCells = 2; // 2
let size = 32;

let spec = {
  inputMode: inputMode, //1
  neighboursCells: neighboursCells, //Neighbour cells. 1 => 9 cells, 2 => 25 cells...
  size: size,
  update: 'qlearn',
  gamma: 0.9,
  epsilon: 0.02,
  alpha: 0.005,
  experience_add_every: 5,
  tderror_clamp: 1.0,
  num_hidden_units: 100
};

// Init function, setup objects
function setup() {
  snake = new Snake();
  fruit = new Fruit();
  agent = new Agent(spec);
  context.fillStyle = 'white';
  context.font = '26px sans-serif';
  fruit.pickLocation(); // Choose random location
  if (localStorage.getItem('highestScoreKey') === null)
    localStorage['highestScoreKey'] = 0;
}

function showTitle(displayScore) {
  // Redraw header area background
  context.fillStyle = '#1e293b'; 
  context.fillRect(0, 0, canvas.width, scale * 2);

  // Header bottom border
  context.strokeStyle = 'rgba(59, 130, 246, 0.4)';
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(0, scale * 2);
  context.lineTo(canvas.width, scale * 2);
  context.stroke();

  // Draw title text
  context.fillStyle = '#38bdf8'; 
  context.font = 'bold 18px "Inter", sans-serif';
  context.fillText("SNAKE DQN AI", 20, scale + 6);

  // Draw score text
  context.fillStyle = '#e2e8f0'; 
  context.font = '16px "Inter", sans-serif';
  context.textAlign = 'right';
  context.fillText(displayScore, canvas.width - 20, scale + 6);
  context.textAlign = 'left'; // restore alignment
}

function showGameState(displayMessage, colour, xpos, ypos) {
  context.fillStyle = colour;
  context.strokeStyle = 'black';
  context.font = '80px sans-serif';
  context.fillText(displayMessage, canvas.width / xpos, canvas.height / ypos);
  context.strokeText(displayMessage, canvas.width / xpos, canvas.height / ypos);
  context.fill();
  context.stroke();
}

function updateSnakeColour() {
  // Update snake colour to the pause colour
  for (let i = 0; i < snake.tail.length; i++) {
    context.beginPath();
    context.arc(snake.tail[i].x + 16, snake.tail[i].y + 16, 15, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
  }
}

// Runs game // MAIN
function updateGame() {
  // Draw sleek dark slate board
  context.fillStyle = '#0f172a';
  context.fillRect(0, 0, canvas.width, canvas.height);

  // Draw grid checkered squares
  for (let r = 2; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      if ((r + c) % 2 === 0) {
        context.fillStyle = '#0b0f19'; // Slightly darker square
        context.fillRect(c * scale, r * scale, scale, scale);
      }
    }
  }

  fruit.draw();
  snake.draw();
  let displayScore =
    'Score: ' + snake.total + '  |  Record: ' + Math.max(snake.total, localStorage['highestScoreKey']);

  if (snake.paused == false) {
    snake.update(); // Update frame
    this.showTitle(displayScore);
    agent.trainAgent();
    agent.showAgentStats();
    this.highestScore();
  } else {
    this.onPaused();
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

function onPaused() {
  if (!snake.gameOver) {
    displayScore =
      snake.total + '   Highest Score: ' + Math.max(snake.total, localStorage['highestScoreKey']);
    showTitle(displayScore);
    this.showGameState('Paused', 'yellow', 3.5, 1.75);
  }
}

document.onkeydown = function (event) {
  // keyCode = Convert keyboard action to number
  if (event.keyCode >= 79) {   // pause = 80, sound = 79
    snake.toggleButtons(event.keyCode);
  }
  else { // Before AI was implemented, could control snake
    snake.changeDirection(event.keyCode);
  }
};

function highestScore() {
  if (snake.total > localStorage['highestScoreKey'])
    localStorage['highestScoreKey'] = snake.total; // only strings
}
