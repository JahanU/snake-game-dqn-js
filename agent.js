const NEIGHBOURS_CELLS = 1; //The input is the n neighbour cells & angle to apple

function Agent(spec) {

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

    // alert(this.neighboursCells) // 2
    // alert(that.spec.inputMode) // 1
    // alert(GRID_MODE)// 0
    // alert((2 + that.spec.inputMode === GRID_MODE)) // false
    // alert((that.spec.size * that.spec.size)) // 400 == canvas size
    // alert(Math.pow(1 + 2 * that.spec.neighboursCells, 2)) // 25

    // create the DQN agent
    this.agent = new RL.DQNAgent(this.env, this.spec);


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
            if (this.gameReward > this.totGamesMaxReward) this.totGamesMaxReward = this.gameReward;
            if (this.gameReward < this.totGamesMinReward) this.totGamesMinReward = this.gameReward;
            this.gameReward = 0;
        }
    }

    this.act = function (input) {
        return this.agent.act(input);
    }

    this.learn = function (reward) {
        this.agent.learn(reward);
    }

    this.trainAgent = function () {
        let direction = getBrainDecision();
        let reward = getReward();
        snake.agentMoveSnake(direction);

        var res = 0;
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
    this.showAgentStats = function () {
        document.getElementById('itt').innerText = 'Itt:' + this.agent.t;
        document.getElementById('rew').innerText = 'Rew: ' +
            agent.rewardCount.totGamesMinReward.toFixed(2) +
            ' - ' +
            agent.rewardCount.totGamesMaxReward.toFixed(2) +
            ' - ' +
            agent.rewardCount.totGamesMeanReward.toFixed(2);
        document.getElementById('scoretxt').value =
            agent.rewardCount.totGamesMeanReward;
    }


    //ML
    function getBrainDecision() {
        let input = []; // Stores game episode to learn from

        input.push(map(snake.getAngleToFruit(), -180, 180, 0, 1));
        input.push(
            map(snake.getDistanceToFruit(), 0, Math.sqrt(2 * (size * size)), 0, 1)
        );

        let action = agent.act(input); // Act based on batch data
        // Here we are storying past plays so that the agent can learn and improve
        return action;
    }

    function getReward() {
        return map(
            snake.getDistanceToFruit(),
            0,
            Math.sqrt(2 * (size * size)),
            agent.rewards.nearApple,
            agent.rewards.farApple
        );
    }


}