const NEIGHBOURS_CELLS = 1; //The input is the n neighbour cells & angle to apple

class Agent {
  constructor(spec, snake, fruit, canvas, metricPrefix, highscoreKey) {
    this.spec = spec;
    this.snake = snake;
    this.fruit = fruit;
    this.canvas = canvas;
    this.prefix = metricPrefix;
    this.highscoreKey = highscoreKey;

    this.env = {
      getNumStates: function () {
        return 6; // angle, distance, 4 obstacle sensors
      },
      getMaxNumActions: function () {
        return 4;
      }
    };

    // create the DQN agent
    this.agent = new RL.DQNAgent(this.env, this.spec);
    console.log(this.agent)

    this.rewards = {
      apple: 100.0,
      death: -100.0,
      farApple: -10.0,
      nearApple: 10.0
    };

    this.rewardCount = {
      nGames: 0,
      gameReward: 0,
      totGamesReward: 0,
      totGamesMeanReward: 0,
      totGamesMinReward: 9999999,
      totGamesMaxReward: -999999,
      recordReward: function () {
        this.nGames++;
        this.totGamesReward += this.gameReward;
        this.totGamesMeanReward = this.totGamesReward / this.nGames;
        if (this.gameReward > this.totGamesMaxReward)
          this.totGamesMaxReward = this.gameReward;
        if (this.gameReward < this.totGamesMinReward)
          this.totGamesMinReward = this.gameReward;
        this.gameReward = 0;
      }
    };
  }

  act(input) {
    return this.agent.act(input);
  }

  learn(reward) {
    this.agent.learn(reward);
  }

  trainAgent() {
    let reward = this.getReward();
    let res = 0;

    if (this.snake.eat(this.fruit)) {
      this.fruit.pickLocation();
      res = 1;
      reward = this.rewards.apple;
    } else if (this.snake.checkCollision() == true) {
      res = -1;
      reward = this.rewards.death;
    }
    this.rewardCount.gameReward += reward;

    if (this.hasActed) {
      this.learn(reward);
    }

    if (res === -1) {
      this.rewardCount.recordReward();
    }

    let direction = this.getBrainDecision();
    this.snake.agentMoveSnake(direction);
    this.hasActed = true;
  }

  showAgentStats() {
    document.getElementById(`${this.prefix}-itt`).innerText = this.agent.t;
    document.getElementById(`${this.prefix}-games`).innerText = this.rewardCount.nGames;
    document.getElementById(`${this.prefix}-epsilon`).innerText = this.agent.epsilon.toFixed(4);
    document.getElementById(`${this.prefix}-tderror`).innerText = this.agent.tderror.toFixed(5);
    document.getElementById(`${this.prefix}-score`).innerText = this.snake.total;
    document.getElementById(`${this.prefix}-highscore`).innerText = localStorage[this.highscoreKey] || 0;

    document.getElementById(`${this.prefix}-cur-rew`).innerText = this.rewardCount.gameReward.toFixed(2);
    document.getElementById(`${this.prefix}-mean-rew`).innerText = this.rewardCount.totGamesMeanReward.toFixed(2);
    document.getElementById(`${this.prefix}-min-rew`).innerText =
      this.rewardCount.totGamesMinReward === 9999999 ? 'N/A' : this.rewardCount.totGamesMinReward.toFixed(2);
    document.getElementById(`${this.prefix}-max-rew`).innerText =
      this.rewardCount.totGamesMaxReward === -999999 ? 'N/A' : this.rewardCount.totGamesMaxReward.toFixed(2);
  }

  //ML
  getBrainDecision() {
    let input = []; // Stores game episode to learn from
    input.push(map(this.snake.getAngleToFruit(), -180, 180, 0, 1));
    let maxDist = Math.sqrt(this.canvas.width * this.canvas.width + this.canvas.height * this.canvas.height);
    input.push(map(this.snake.getDistanceToFruit(), 0, maxDist, 0, 1));
    let obstacles = this.snake.getObstacles();
    input.push(...obstacles);
    let action = this.act(input); // Act based on batch data
    return action;
  }

  getReward() {
    let maxDist = Math.sqrt(this.canvas.width * this.canvas.width + this.canvas.height * this.canvas.height);
    return map(
      this.snake.getDistanceToFruit(),
      0,
      maxDist,
      this.rewards.nearApple,
      this.rewards.farApple
    );
  }
}
