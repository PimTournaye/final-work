import { w, h } from "./sketch";

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
    }

    // move the ball
    move() {
        this.x += this.speed * this.direction.x;
        this.y += this.speed * this.direction.y;
        // bounce off walls
        if (this.x < 0) {
            this.x = 0;
            this.direction.x *= -1;
        }
        if (this.x > w) {
            this.x = w;
            this.direction.x *= -1;
        }
        if (this.y < 0) {
            this.y = 0;
            this.direction.y *= -1;
        }
        if (this.y > h) {
            this.y = h;
            this.direction.y *= -1;
        }
    }

    // check collisions with paddles or event blocks
    checkCollision() {
    
    }

    // change direction of the ball
    changeDirection(direction) {
        this.direction = direction;
    }

    update(){
        this.draw()
        this.move();
        //this.checkCollision();
    }
}