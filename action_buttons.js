this.changeDirection = function (direction) {
    if (direction != 80) {
        this.lastDirection = direction;
    }

    // Convert keyboard action to number
    switch (direction) {
        case 37: // LEFT
            this.xSpeed = -scale * 1;
            this.ySpeed = 0;
            break;
        case 38: // UP
            this.xSpeed = 0;
            this.ySpeed = -scale * 1;
            break;
        case 39: // RIGHT
            this.xSpeed = scale * 1;
            this.ySpeed = 0;
            break;
        case 40: // DOWN
            this.xSpeed = 0;
            this.ySpeed = scale * 1;
            break;
        case 80:
            this.paused = !this.paused; // Opposite value
            if (this.paused) {
                break;
            } else {
                this.changeDirection(this.lastDirection);
                break;
            }
    }
};