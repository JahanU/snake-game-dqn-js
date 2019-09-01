const NEIGHBOURS_CELLS = 1; //The input is the n neighbour cells & angle to apple

class Agent {

    constructor(spec) {
        this.inputMode = inputMode;
        this.neighboursCells = neighboursCells;
        this.spec = spec;
        let that = this;

        this.env = {
            getNumStates: function () {
                return 2 + Math.pow(1 + 2 * that.spec.neighboursCells, 2); // 27
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

    }

    act(input) {
        return this.agent.act(input);
    }
    learn(reward) {
        this.agent.learn(reward);
    }
}