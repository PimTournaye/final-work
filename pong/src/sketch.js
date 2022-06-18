import { WebMidi } from 'webmidi';
import { sketch } from 'p5js-wrapper';
import { io } from "socket.io-client";
import { Bundle } from 'node-osc';

import Keyboard from './Keyboard';
import PongBall from './PongBall';
import { SOCKET_PORT, SOCKET_ADDRESS } from './config';

let ballX, ballY, div;

export let w = window.innerWidth;
export let h = window.innerHeight;
export let inputs = [];

let playerLeft, playerRight;
export let PLAYERS = [];
export let ball;
// Giving a starting value to the keys
export let [keysLeft, keysRight] = [[54], [54]];

let arduinoData = {};
let OSC;

// Socket.io setup if ESP_MODE is true
if (ESP_MODE) {
  const socket = io(`http://${SOCKET_ADDRESS}:${SOCKET_PORT}`);
  socket.on("data", (data) => {
    console.log('got data');
    //console.log(data);
  })
  socket.on("arduino_event", (data) => {
    // check if the data is different from the last one
    if (data.speed !== arduinoData.speed || data.drums !== arduinoData.drums || data.others !== arduinoData.others || data.piano1 !== arduinoData.piano1 || data.piano2 !== arduinoData.piano2) {
      arduinoData = {
        speed: data.speed,
        drums: data.drums,
        others: data.others,
        piano1: data.piano1,
        piano2: data.piano2,
      }
    }
  })
}

// Setup OSC messaging if in USE_OSC mode
if (USE_OSC) {
  OSC = new OSC_Client(OSC_ADDRESS, OSC_PORT);
}

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
    // Spread operaters didn't work here for whatever reason, so I had to do it this way
    inputs.push(input1);
    inputs.push(input2);

    // Setup the keyboards
    playerLeft = new Keyboard('left', keysLeft, 1);
    playerRight = new Keyboard('right', keysRight, 0);

    //PLAYERS.push(...playerLeft, ...playerRight);
    PLAYERS.push(playerLeft, playerRight);
  })
  .catch(err => div.innerHMTL = `WebMidi could not be enabled. Please check your keyboards. \n ${err}`);

// p5 SETUP
sketch.setup = () => {
  createCanvas(w, h);
  frameRate(20)

  // define ballX and ballY starting position
  ballX = width / 2;
  ballY = height / 2;

  //create a div for debugging
  div = createDiv('');
  div.style('font-size', '16px');
  div.id = '#active'
  div.position(width / 2, height / 2);

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

  if (ESP_MODE) {
    // Update the ball velocity based on the arduino data
    ball.velocity.x = arduinoData.speed;
    ball.velocity.y = arduinoData.speed;

    // If in USE_OSC mode, send the data to the OSC server
    if (USE_OSC) {
      // Make new bundle to avoid having to send data five seperate times
      const bundle = new Bundle(['/speed', arduinoData.speed], ['/drums', arduinoData.drums], ['/others', arduinoData.others], ['/piano1', arduinoData.piano1], ['/piano2', arduinoData.piano2]);

      OSC.setBundle(bundle);
      OSC.send();
    }

  }



}