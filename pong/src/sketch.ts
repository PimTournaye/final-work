import { WebMidi } from 'webmidi';
import { p5, sketch } from 'p5js-wrapper';

let name1 = "Launchkey MK3 49 LKMK3 MIDI Out"
let name2 = "Keystation 61 MK3"
let name3 = "KOMPLETE KONTROL M32"

// Set arbirary note number to compare later
let lowestNoteRight = 54;
let lowestNoteLeft = 54;
let highestNoteRight = 54;
let highestNoteLeft = 55;
let keyboard1, keyboard2;
let ballX, ballY, ballXSpeed, ballYSpeed, div;

sketch.setup = () => {
  createCanvas(1200, 900);

  // define ballX and ballY
  ballX = width / 2;
  ballY = height / 2;

  //define ballYSpped and ballXSpeed
  ballXSpeed = random(-5, 5);
  ballYSpeed = random(-5, 5);

  WebMidi
    .enable()
    .then(() => {
      console.log('WebMidi enabled!');

      WebMidi.inputs.forEach((device, index) => {
        console.log(`${index}: ${device.name}`);
      });
      //keyboard1 = WebMidi.getInputByName("KOMPLETE KONTROL M32").channels[1];
      keyboard1 = WebMidi.getInputByName(name2).channels[1];
      keyboard2 = WebMidi.getInputByName(name2).channels[1];
    })
    .catch(err => alert(err));

div = createDiv('this is some text');
div.style('font-size', '16px');
div.id = '#active'
div.position(width/2, height/2);

}

// only start draw once the MIDI device is connected and the lowest and highest note are defined and remain the same for at least 10 seconds


sketch.draw = () => {
  background(220);
  getKeyboardRange();
  // if keyboard range remains the same for at least 10 seconds, stop calling getKeyboardRange()

  drawPianoKeys('right');
  drawPianoKeys('left');
  drawBall();
  displayActiveNotes();
}

// draw the paddle ranging from the lowest active note to the highest active note and the side of the screen
function drawPaddle(side) {
  if (side === 'right') {
    fill(255);
    // define the paddle height from the lowest active note to the highest active note

  } else {
    fill(255);
    rect(0, 0, 20, height);
  }
}


// listen for 

// function that puts all the active notes in an array using webmidi
function getActiveNotes() {
  let activeNotes = [];
  try {
    keyboard1.addListener("noteon", e => {
      activeNotes.push(e.note.number);
    });
    keyboard1.addListener("noteoff", e => {
      activeNotes.splice(activeNotes.indexOf(e.note.number), 1);
    });
    if (activeNotes.length = 0) {
      console.log('no active notes');
        }
  } catch (error) {
    console.log(error);
  }
  return activeNotes;
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

function drawPianoKeys(side) {
  if (side == 'left') {
    let y = 0;
    let keyWidth = 60;
    let keyHeight = height / (highestNoteLeft - lowestNoteLeft + 1);
    for (let i = lowestNoteLeft; i <= highestNoteLeft; i++) {
      let key = i;
      let keyColor = color(255);
      // check for black piano keys and change color in the range of the lowest note to the highest note
      if (key % 12 == 1 || key % 12 == 3 || key % 12 == 6 || key % 12 == 8 || key % 12 == 10) {
        keyColor = color(0);
      }
      // if a key is played on the connected MIDI device, draw the key as red

      fill(keyColor);
      rect(0, y, keyWidth, keyHeight);

      // change y position for next key
      y += keyHeight;
    }
  }

  if (side == 'right') {
    let y = 0;
    let keyWidth = 60;
    let keyHeight = height / (highestNoteRight - lowestNoteRight + 1);
    for (let i = lowestNoteRight; i <= highestNoteRight; i++) {
      let key = i;
      let keyColor = color(255);
      // check for black piano keys and change color in the range of the lowest note to the highest note
      if (key % 12 == 1 || key % 12 == 3 || key % 12 == 6 || key % 12 == 8 || key % 12 == 10) {
        keyColor = color(0);
      }
      // if a key is played on the connected MIDI device, draw the key as red
      fill(keyColor);
      rect(width - keyWidth, y, keyWidth, keyHeight);

      // change y position for next key
      y += keyHeight;
    }
  }
}

// draw a pong ball and move it around the screen like in the pong game
function drawBall() {
  fill(255, 0, 0);
  rect(ballX, ballY, 20, 20);
  ballX += ballXSpeed;
  ballY += ballYSpeed;
  if (ballX > width || ballX < 0) {
    ballXSpeed *= -1;
  }
  if (ballY > height || ballY < 0) {
    ballYSpeed *= -1;
  }
}

function getKeyboardRange() {
  try {
    keyboard1.addListener("noteon", e => {
      if (e.note.number > highestNoteRight) {
        highestNoteRight = e.note.number;
      }
      if (e.note.number < lowestNoteRight) {
        lowestNoteRight = e.note.number;
      }
    });

    keyboard2.addListener("noteon", e => {
      if (e.note.number > highestNoteLeft) {
        highestNoteLeft = e.note.number;
      }
      if (e.note.number < lowestNoteLeft) {
        lowestNoteLeft = e.note.number;
      }
    });
  } catch (error) {
    console.log(error);
  }
}