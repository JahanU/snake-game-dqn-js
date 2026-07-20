### Snake Game

begun as just a game, but later into turned into an AI project.

https://jahanu.github.io/snake-game-dqn-js/

## Recent Fixes

The following fixes were implemented to properly integrate the Deep Q-Network (DQN) and enable the agent to learn effectively:

### 1. DQN Input Size Mismatch
The agent was configured to expect a state vector of size `27` (or `11`), based on an unimplemented `neighboursCells` logic. However, `agent.js` was only providing an array of `2` items (the distance and angle to the apple). Because the network architecture's input layer size didn't match the actual input being fed into it, it couldn't learn properly.
* **Fix**: Changed `getNumStates` in `agent.js` to return `6`, matching the exact number of inputs we are now providing.

### 2. Missing Obstacle Awareness
The DQN originally only knew the angle and distance to the fruit, but it was entirely blind to walls and its own tail. Without sensors to detect obstacles, it would inevitably crash while trying to grab an apple.
* **Fix**: Implemented a `getObstacles` method in `snake.js` that checks for immediate wall collisions or tail collisions in all 4 directions (Up, Right, Down, Left). The agent now receives these 4 boolean values as part of its state inputs, allowing it to learn that moving into a wall yields a lethal `-100` reward.

### 3. Asynchronous RL Training Loop
The RL framework (`RL.js`) requires a specific sequence: you must decide an action, observe the environment transition, and then `learn()` from that reward. In the previous loop, `agent.act()` was called, the game state evaluated the reward *before* the action actually took effect, and `agent.learn()` applied that reward incorrectly.
* **Fix**: Reordered `trainAgent` in `agent.js`. It now observes the reward resulting from the **previous** frame's action, runs `agent.learn(reward)`, and then chooses the next action for the current frame. This properly aligns the action with the consequence it caused. 

### 4. Broken Distance Logic & Normalization
The `getDistanceToFruit` function was using `this.tail[this.tail.length - 1]` to calculate the distance. If the snake had no tail (at the very beginning), this would index out of bounds or use stale coordinates instead of the actual head. Additionally, the maximum distance normalization in `map` was using an extremely small max distance bound (`Math.sqrt(2 * (32 * 32)) == ~45`), which severely distorted the distance reward scaling on a 608x608 canvas. 
* **Fix**: Updated `getDistanceToFruit` to use the snake's actual head (`this.x` and `this.y`). Updated the max distance normalization in `agent.js` to correctly scale based on the entire canvas diagonal `Math.sqrt(canvas.width^2 + canvas.height^2)`.
