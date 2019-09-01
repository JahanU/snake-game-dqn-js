const canvas = document.querySelector('.canvas'); // Get access to the canvas
const context = canvas.getContext('2d'); // Allows us to do 2D edits to the canvas (i.e draw on the canvas)
const scale = 32; // Size
const rows = canvas.height / scale;
const columns = canvas.width / scale;
let snake;
let fruit;
// Init function, setup objects
function setup() {
  // alert(
  //   'Snake Game written with Javascript!\nYou can use the arrow keys and the "P" button to pause and resume the game.'
  // );
  snake = new Snake(); // Init objects
  fruit = new Fruit();
  groundImage = new Image();
  groundImage.src = 'ground.png';
  context.fillStyle = 'white';
  context.font = '26px sans-serif';
  fruit.pickLocation(); // Choose random location
  if (localStorage.getItem('highestScoreKey') === null)
    localStorage['highestScoreKey'] = 0;
}

setup();

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

  for (let i = 0; i < snake.tail.length; i++) {
    context.beginPath();
    context.arc(snake.tail[i].x + 16, snake.tail[i].y + 16, 15, 0, 2 * Math.PI);
    context.fill();
    context.stroke();
  }
}

function updateGame() {
  context.drawImage(groundImage, 0, 0);
  fruit.draw();
  snake.draw();

  let displayScore = snake.total + '   Highest Score: ' + localStorage['highestScoreKey'] || '0';

  if (snake.paused == false) {
    snake.update();
    this.showTitle(displayScore);

    snake.eat(fruit) ? fruit.pickLocation() : snake.checkCollision();
  }

  if (snake.paused & !snake.gameOver) {
    displayScore =
      snake.total + '   Highest Score: ' + localStorage['highestScoreKey'];
    showTitle(displayScore);
    this.showGameState('Paused', 'yellow', 3.5, 1.75);
  } else if (snake.gameOver && snake.paused) {
    this.title =
      snake.total + '   Highest Score: ' + localStorage['highestScoreKey'];
    showTitle(displayScore);
    this.showGameState('GAME OVER', 'red', 9.2, 1.75);
    this.highestScore();
  }
}
window.setInterval(this.updateGame, 110); // Speed, update frames rate

// Pass any action from the keyboard to change the snake direction
document.onkeydown = function (event) {
  snake.changeDirection(event.keyCode); // Convert keyboard action to number
};

this.highestScore = function () {
  if (snake.total > localStorage['highestScoreKey'])
    localStorage['highestScoreKey'] = snake.total; // only strings
};