class Paddle {
    constructor(x, y, height) {
        this.x = x;
        this.y = y;
        this.width = 10;
        this.height = height;
    }

    draw() {
        fill(255);
        rect(this.x, this.y, this.width, this.height);
    }

    update(y, height){
        this.y = y;
        this.height = height;
    }
}

    