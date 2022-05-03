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
        ballX += ballXSpeed;
        ballY += ballYSpeed;
        if (ballX > width || ballX < 0) {
            ballXSpeed *= -1;
        }
        if (ballY > height || ballY < 0) {
            ballYSpeed *= -1;
        }
    }

    // move the ball
    move() {
        this.x += this.speed * this.direction.x;
        this.y += this.speed * this.direction.y;
    }

    // change direction of the ball
    changeDirection(direction) {
        this.direction = direction;
    }
}