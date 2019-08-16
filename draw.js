const canvas = document.querySelector('.canvas'); // Get access to the canvas
const context = canvas.getContext('2d'); // Allows us to do 2D edits to the canvas (i.e draw on the canvas)
const scale = 32; // Size
const rows = canvas.height / scale;
const columns = canvas.width / scale;
let snake;
let fruit;
let title;
// Init function, setup objects
function setup() {
  snake = new Snake(); // Init objects
  fruit = new Fruit();
  groundImage = new Image();
  groundImage.src = 'ground.png';
  context.fillStyle = "white";
  context.font = '26px Changa one';
  fruit.pickLocation(); // Choose random location
}; // double bracket at the end makes it run

setup();


function updateGame() {
  context.drawImage(groundImage, 0, 0);

  fruit.draw();
  snake.draw();

  if (snake.paused == false) {
    snake.update();

    this.title = 'Highest Score: ' + localStorage['highestScoreKey'] || '0';
    context.fillText(this.title, rows * 4, columns * 3);

    snake.eat(fruit) ? fruit.pickLocation() : snake.checkCollision();
    document.querySelector('.score').innerHTML = snake.total; // Update score

    this.title = 'Highest Score: ' + localStorage['highestScoreKey'] || '0'; // Display highest Score
    context.fillText(this.title, rows * 4, columns * 3);
  }
  if (snake.paused & !snake.gameOver) {
    this.title = 'Highest Score: ' + localStorage['highestScoreKey'] + ' Paused';
    context.fillText(this.title, rows * 4, columns * 3);
  }
  if (snake.gameOver && snake.paused) {
    this.title = 'Highest Score: ' + localStorage['highestScoreKey'] + ' Game Over';
    context.fillText(this.title, rows * 4, columns * 3);
    this.highestScore();
  }
}

window.setInterval(this.updateGame, 110); // Speed, update frames rate

// Pass any action from the keyboard to change the snake direction
document.onkeydown = function (event) {
  snake.changeDirection(event.keyCode); // Convert keyboard action to number
};

this.highestScore = function () {
  if (localStorage.getItem('highestScoreKey') === null)
    localStorage['highestScoreKey'] = 0;

  if (snake.total > localStorage['highestScoreKey'])
    localStorage['highestScoreKey'] = snake.total; // only strings
};