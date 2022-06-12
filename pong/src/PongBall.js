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
    if (this.x - this.radius < 0) {
      this.x = 0 + this.radius;
      this.direction.x *= -1;
    }
    if (this.x + this.radius > w) {
      this.x = w - this.radius;
      this.direction.x *= -1;
    }
    if (this.y - this.radius < 0) {
      this.y = 0 + this.radius;
      this.direction.y *= -1;
    }
    if (this.y + this.radius > h) {
      this.y = h - this.radius;
      this.direction.y *= -1;
    }
  }

  // check collisions with paddles or event blocks
  checkCollision(PLAYERS) {
    PLAYERS.forEach(Keyboard => {
      let paddle = Keyboard.paddle;
      let side = Keyboard.side;
      let active = paddle.active;
      if (side === 'left') {
        if (!active) {
          return;
        }
        if (!(this.x - this.radius < paddle.x + paddle.width)) {
          return;
        }
        if (this.y - this.radius > paddle.y && this.y + this.radius < paddle.height) {
          this.direction.x *= -1;
          console.log('bounced on paddle - left');
        }
      } else {
        if (!active) {
          return;
        }
        if (!(this.x + this.radius > paddle.x)) {
          return;
        }
        if (this.y - this.radius > paddle.y && this.y + this.radius < paddle.height) {
          this.direction.x *= -1;
          console.log('bounced on paddle - right');
        }
      }
    });

  }

  // change direction of the ball
  changeDirection(direction) {
    this.direction = direction;
  }

  // Update the ball object
  update() {
    this.draw();
    this.move();
  }
}