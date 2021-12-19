const NEIGHBOURS_CELLS = 1; //The input is the n neighbour cells & angle to apple

class Agent {
  constructor(spec) {
    this.inputMode = inputMode;
    this.neighboursCells = neighboursCells;
    this.spec = spec;

    this.env = {
      getNumStates: function () {
        return 2 + Math.pow(1 + 2 * spec.neighboursCells, 2); // 27
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
    let direction = agent.getBrainDecision();
    snake.agentMoveSnake(direction);
    let reward = agent.getReward();
    let res = 0;

    if (snake.eat(fruit)) {
      fruit.pickLocation();
      res = 1;
      reward = agent.rewards.apple;
    } else if (snake.checkCollision() == true) {
      res = -1;
      reward = agent.rewards.death;
    }
    agent.rewardCount.gameReward += reward;
    agent.learn(reward);

    if (res === -1) {
      agent.rewardCount.recordReward();
    }
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
    input.push(map(snake.getDistanceToFruit(), 0, Math.sqrt(2 * (size * size)), 0, 1));
    let action = agent.act(input); // Act based on batch data
    // Here we are storying past plays so that the agent can learn and improve
    return action;
  }

  getReward() {
    return map(
      snake.getDistanceToFruit(),
      0,
      Math.sqrt(2 * (size * size)),
      agent.rewards.nearApple,
      agent.rewards.farApple
    );
  }
}
