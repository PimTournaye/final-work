export default class Paddle {
    constructor(x, lowestActive, highestActive) {
        this.x = x;
        this.y = lowestActive;
        this.width = 10;
        this.height = highestActive - lowestActive;
        this.active = false;
    }

    draw() {
        fill(150, 0, 20);
        rect(this.x, this.y, this.width, this.height);
        this.active = true;
    }

    updateRect(y, height) {
        this.y = y;
        this.height = height;
    }
}