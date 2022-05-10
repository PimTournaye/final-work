export default class Paddle {
    constructor(x, lowestActive, highestActive) {
        this.x = x;
        this.y = lowestActive;
        this.width = 10;
        this.height = highestActive - lowestActive;
    }

    draw() {
        fill(200);
        rect(this.x, this.y, this.width, this.height);
    }

    update(y, height){
        this.y = y;
        this.height = height;
    }
}

    