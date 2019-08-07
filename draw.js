const canvas = document.querySelector('.canvas');
const context = canvas.getContext('2d');
const scale = 20; // Size
const rows = canvas.height / scale;
const columns = canvas.width / scale;
var snake;

(function setup() {
  snake = new Snake(); // Init objects
  fruit = new Fruit();
  fruit.pickLocation(); // Choose random location

  // Updates view
  window.setInterval(() => {
    context.clearRect(0, 0, canvas.width, canvas.height);
    fruit.draw();
    snake.draw();

    if (snake.paused == false) {
      document.querySelector('.paused').innerText = '';
      snake.update();

      if (snake.eat(fruit)) { // If snake touches fruit, then update fruit location
        fruit.pickLocation();
      } else { // else check for detection
        snake.checkCollision();
      }
      document.querySelector('.score').innerText = snake.total; // Update score
      document.querySelector('.highest_score').innerText = 'highest Score: ' + localStorage['highestScoreKey'] || '' // Display highest Score

    }
    if (snake.paused) {
      document.querySelector('.paused').innerText = 'Paused';
    }
    if (snake.gameOver) {
      document.querySelector('.paused').innerText = 'Game Over';
      this.highestScore();
    }
  }, 115); // Speed
})();

// Pass any action from the keyboard to change the snake direction
document.onkeydown = function (event) {
  snake.changeDirection(event.keyCode); // Convert keyboard action to number
};
document.getElementsByClassName('buttons').addEventListener('click', function () {
  alert('!!')
  snake.changeDirection(event); // Convert keyboard action to number
});



this.highestScore = function () {
  localStorage['highestScoreKey'] = 0
  if (snake.total > this.localStorage['highestScoreKey'])
    localStorage['highestScoreKey'] = snake.total; // only strings
}