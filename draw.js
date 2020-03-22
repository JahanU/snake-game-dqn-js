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

setup();
// Init function, setup objects
function setup() {
  snake = new Snake();
  fruit = new Fruit();
  agent = new Agent(spec);
  groundImage = new Image();
  groundImage.src = 'ground.png';
  context.fillStyle = 'white';
  context.font = '26px sans-serif';
  fruit.pickLocation(); // Choose random location
  if (localStorage.getItem('highestScoreKey') === null)
    localStorage['highestScoreKey'] = 0;
}

function showTitle(displayScore) {
  context.fillStyle = 'white';
  context.font = '26px sans-serif';
  context.fillText(displayScore, rows * 2, columns * 2.5);
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
  context.drawImage(groundImage, 0, 0);
  fruit.draw();
  snake.draw();
  let displayScore =
    snake.total + '   Highest Score: ' + localStorage['highestScoreKey'] || '0';

  if (snake.paused == false) {
    snake.update(); // Update frame
    this.showTitle(displayScore);
    agent.trainAgent();
    agent.showAgentStats();
  } else {
    this.onPaused();
  }
}
window.setInterval(this.updateGame, 60); // Speed, update frames rate

function onPaused() {
  if (snake.paused && !snake.gameOver) {
    displayScore =
      snake.total + '   Highest Score: ' + localStorage['highestScoreKey'];
    showTitle(displayScore);
    this.showGameState('Paused', 'yellow', 3.5, 1.75);
  } else if (snake.gameOver && snake.paused) {
    this.highestScore();
  }
}

document.onkeydown = function(event) {
  // keyCode = Convert keyboard action to number
  // pause and aresound are both 80, 81
  if (event.keyCode >= 79) {
    snake.toggleButtons(event.keyCode);
  } else {
    snake.changeDirection(event.keyCode);
  }
};

function highestScore() {
  if (snake.total > localStorage['highestScoreKey'])
    localStorage['highestScoreKey'] = snake.total; // only strings
}
