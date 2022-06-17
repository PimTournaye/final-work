import { WebMidi } from 'webmidi';
import { sketch } from 'p5js-wrapper';
import Keyboard from './Keyboard';
import PongBall from './PongBall';
import { SOCKET_PORT } from './config';

import { io } from "socket.io-client";

if (ESP_MODE) {
  const socket = io(`http://localhost:${SOCKET_PORT}`);

  socket.on("data", (data) => {
    console.log('got data');
    //console.log(data);
  })
  socket.on("arduino_event", (data) => {
    console.log('got data arduino');
    //console.log(data);
  })

}

let ballX, ballY, div;

export let w = window.innerWidth;
export let h = window.innerHeight;
export let inputs = [];

let playerLeft, playerRight;
export let PLAYERS = [];
export let ball;
// Giving a starting value to the keys
export let [keysLeft, keysRight] = [[54], [54]];

// MIDI SETUP
WebMidi
  .enable()
  .then(() => {
    console.log('WebMidi enabled!');
    WebMidi.inputs.forEach((device, index) => {
      console.log(`${index}: ${device.name}`);
    });
    // doing some weird stuff to but it makes WebMidi work properly
    let input1 = WebMidi.getInputByName(MIDI_INSTRUMENT_PLAYER_LEFT);
    let input2 = WebMidi.getInputByName(MIDI_INSTRUMENT_PLAYER_RIGHT);
    inputs.push(input1);
    inputs.push(input2);

    // Setup the keyboards
    playerLeft = new Keyboard('left', keysLeft, 1);
    playerRight = new Keyboard('right', keysRight, 0);

    //PLAYERS.push(...playerLeft, ...playerRight);
    PLAYERS.push(playerLeft, playerRight);
  })
  .catch(err => console.log(err));

// p5 SETUP
sketch.setup = () => {
  createCanvas(w, h);
  frameRate(20)

  // define ballX and ballY starting position
  ballX = width / 2;
  ballY = height / 2;

  // create a div for debugging
  // div = createDiv('this is some text');
  // div.style('font-size', '16px');
  // div.id = '#active'
  // div.position(width / 2, height / 2);

  // Setup up the pong ball
  let direction = createVector(random(-25, 25), random(-25, 25));
  ball = new PongBall(width / 2, height / 2, 20, 2, direction);

}

// only start draw once the MIDI device is connected and the lowest and highest note are defined and remain the same for at least 10 seconds
sketch.draw = () => {
  background(220);

  ball.update();

  PLAYERS.forEach(keyboard => {
    keyboard.update();
  });

  ball.checkCollision(PLAYERS);

}