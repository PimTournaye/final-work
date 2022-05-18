import Keyboard from "./Keyboard";
import { w, h, PLAYERS } from "./sketch";
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
        PLAYERS.forEach(Keyboard => {
            let paddle = Keyboard.paddle;
            let side = Keyboard.side;
            if (side === 'left') {
                if (!paddle.active) {
                    console.log('not active');
                    return;
                }
                if (!(this.x - this.radius < paddle.x + paddle.width)) {
                    console.log('no collision on x axis');
                    return;
                }
                if (this.y - this.radius > paddle.y && this.y + this.radius < paddle.height) {
                    this.direction.x *= -1;
                    console.log('bounced on paddle');
                }
            }
    
        });

    }

    // change direction of the ball
    changeDirection(direction) {
        this.direction = direction;
    }

    update() {
        this.draw()
        this.move();
        //this.checkCollision();
    }
}