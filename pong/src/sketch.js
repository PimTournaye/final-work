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



  // define ballX and ballY
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

// draw a paddle 10px from the keyboard, ranging from the lowest active note to the highest active note
function drawPaddle(side) {
  let actives = getActiveNotes();
  let lowestActive = actives[0];
  let highestActive = actives[actives.length - 1];
  let paddleWidth = 15;

  let keyHeight = height / (highestActive - lowestActive + 1);


  if (actives.length == 0) {
    return;
  }
  fill(100);
  if (side == 'left') {
    let paddleX = 70;
    // draw a rect from the lowest active note it's corresponding piano key to the highest active note it's corresponding piano key
    rect(paddleX, lowestActive * 60, paddleWidth, (highestActive - lowestActive + 1) * 60);
  } else if (side == 'right') {
    rect(100, 100, paddleWidth, (highestNoteRight - lowestNoteRight + 1) * 60);
    let paddleX = width - 70;
    // draw a rect from the lowest active note it's corresponding piano key to the highest active note it's corresponding piano key
    rect(paddleX, lowestActive * 60, paddleWidth, (highestActive - lowestActive + 1) * 60);
  }
}

// function that puts all the active notes in an array using webmidi
function getActiveNotes() {
  try {
    keyboard1.addListener("noteon", e => {
      // if the e.note.rawAttack is 0, remove it from the array
      if (e.note.rawAttack == 0) {
        activeNotes = activeNotes.filter(note => note != e.note.number);
      } else if (activeNotes.includes(e.note.number)) {
        return;
      } else {
        activeNotes.push(e.note.number);
      }
      //console.log('test 1: ', activeNotes, 'length: ', activeNotes.length);
    });

    keyboard1.addListener("noteoff", e => {
      activeNotes.splice(activeNotes.indexOf(e.note.number), 1);
    });
    //console.log('test 2: ', activeNotes.length, 'active notes', activeNotes);

    // if (activeNotes.length == 0) {
    //   //console.log('no active notes');
    // }
    //console.log('test 3: ', activeNotes.length, 'active notes', activeNotes);
    return activeNotes;
  } catch (error) {
    console.log(error);
  }
}

// draw the output of the getActiveNotes() function in the middle of the screen in purple text
function displayActiveNotes() {
  fill(255, 0, 255);
  textSize(32);
  let html = '';
  let theDiv = document.getElementsByTagName('div')[0];
  let activeNotes = getActiveNotes();
  for (let i = 0; i < activeNotes.length; i++) {
    html += `${activeNotes[i]}, `;
  }
  theDiv.innerHTML = html;
}