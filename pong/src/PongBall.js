export default class PongBall {
    constructor(x, y, radius, speed, direction) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.speed = speed;
        this.direction = createVector(direction.x, direction.y);
    }

    draw() {
        fill(255, 0, 0);
        rect(this.x, this.y, this.radius, this.radius);
        if (ballX > width || ballX < 0) {
            this.direction.x *= -1;
        }
        if (ballY > height || ballY < 0) {
            this.direction.y *= -1;
        }
    }

    // move the ball
    move() {
        this.x += this.speed * this.direction.x;
        this.y += this.speed * this.direction.y;
    }

    // check collisions with paddles or event blocks
    checkCollision() {
        // check collisions with paddles
        if (this.x - this.radius <= paddleLeft.x + paddleLeft.width && this.x + this.radius >= paddleLeft.x && this.y - this.radius <= paddleLeft.y + paddleLeft.height && this.y + this.radius >= paddleLeft.y) {
            this.direction.x *= -1;
        }
        if (this.x - this.radius <= paddleRight.x + paddleRight.width && this.x + this.radius >= paddleRight.x && this.y - this.radius <= paddleRight.y + paddleRight.height && this.y + this.radius >= paddleRight.y) {
            this.direction.x *= -1;
        }
        // check collisions with event blocks
        for (let i = 0; i < eventBlocks.length; i++) {
            if (this.x - this.radius <= eventBlocks[i].x + eventBlocks[i].width && this.x + this.radius >= eventBlocks[i].x && this.y - this.radius <= eventBlocks[i].y + eventBlocks[i].height && this.y + this.radius >= eventBlocks[i].y) {
                eventBlocks[i].destroy();
                this.direction.y *= -1;
            }
        }


    }

    // change direction of the ball
    changeDirection(direction) {
        this.direction = direction;
    }

    update(){
        this.move();
        this.draw()
        this.checkCollision();
    }
}