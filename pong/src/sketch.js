import { WebMidi } from 'webmidi';
import { p5, sketch } from 'p5js-wrapper';
import Keyboard from './Keyboard';
import PongBall from './PongBall';

let name1 = "Launchkey MK3 49 LKMK3 MIDI Out"
let name2 = "Keystation 61 MK3"
let name3 = "KOMPLETE KONTROL M32"
let name4 = 'IAC Driver Bus 1'

// Set arbirary note number to compare later
let lowestNoteRight = 54;
let lowestNoteLeft = 54;
let highestNoteRight = 54;
let highestNoteLeft = 55;

let ballX, ballY, div;
let activeNotes = [];

export let w = 1200;
export let h = 900
export let inputs = [];
let keyboard1, keyboard2

let playerLeft, playerRight;
let PLAYERS = [];

export let [keysLeft, keysRight] = [[54], [54]];

let ball;

// MIDI SETUP
WebMidi
  .enable()
  .then(() => {
    console.log('WebMidi enabled!');
    WebMidi.inputs.forEach((device, index) => {
      console.log(`${index}: ${device.name}`);
    });
    let input1 = WebMidi.getInputByName(name1);
    let input2 = WebMidi.getInputByName(name1);
    inputs.push(input1);
    inputs.push(input2);

    // Setup the keyboards
    playerLeft = new Keyboard('left', keysLeft, 1);
    playerRight = new Keyboard('right', keysRight, 1);

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
  div = createDiv('this is some text');
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
  //getKeyboardRange();
  // if keyboard range remains the same for at least 10 seconds, stop calling getKeyboardRange()
  ball.update();

  //drawPianoKeys('right');
  //drawPianoKeys('left');
  PLAYERS.forEach(keyboard => {
    keyboard.update();
  });


  //drawPaddle('right');
  //displayActiveNotes();
}
