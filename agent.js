const NEIGHBOURS_CELLS = 1; //The input is the n neighbour cells & angle to apple

class Agent {
  constructor(spec) {
    this.inputMode = inputMode;
    this.neighboursCells = neighboursCells;
    this.spec = spec;

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

    if (snake.eat(fruit)) {
      fruit.pickLocation();
      res = 1;
      reward = this.rewards.apple;
    } else if (snake.checkCollision() == true) {
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
    snake.agentMoveSnake(direction);
    this.hasActed = true;
  }

  showAgentStats() {
    document.getElementById('itt').innerText = 'Iterations: ' + this.agent.t;
    document.getElementById('rew').innerText =
      'Min Reward: ' +
      agent.rewardCount.totGamesMinReward.toFixed(2) +
      ', Max Reward: ' +
      agent.rewardCount.totGamesMaxReward.toFixed(2) +
      ', Mean Reward: ' +
      agent.rewardCount.totGamesMeanReward.toFixed(2);
  }

  //ML
  getBrainDecision() {
    let input = []; // Stores game episode to learn from
    input.push(map(snake.getAngleToFruit(), -180, 180, 0, 1));
    let maxDist = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
    input.push(map(snake.getDistanceToFruit(), 0, maxDist, 0, 1));
    let obstacles = snake.getObstacles();
    input.push(...obstacles);
    let action = this.act(input); // Act based on batch data
    return action;
  }

  getReward() {
    let maxDist = Math.sqrt(canvas.width * canvas.width + canvas.height * canvas.height);
    return map(
      snake.getDistanceToFruit(),
      0,
      maxDist,
      this.rewards.nearApple,
      this.rewards.farApple
    );
  }
}
