// Set arbirary note number to compare later
let lowestNoteRight = 54;
let lowestNoteLeft = 54;
let highestNoteRight =54; 
let highestNoteLeft = 55;
let keyboard1, keyboard2;

function setup() {
  createCanvas(1200, 900);

  // define ballX and ballY
  ballX = width / 2;
  ballY = height / 2;
  
  //define ballYSpped and ballXSpeed
  ballXSpeed = random(-5, 5);
  ballYSpeed = random(-5, 5);

  WebMidi
    .enable()
    .then(onEnabled)
    .catch(err => alert(err));
}

// only start draw once the MIDI device is connected and the lowest and highest note are defined and remain the same for at least 10 seconds


function draw() {
  background(220);
  getKeyboardRange();
  // if keyboard range remains the same for at least 10 seconds, stop calling getKeyboardRange()

  drawPianoKeys('right');
  drawPianoKeys('left');
  drawBall();
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
    let keyHeight = height / (highestNoteRight - lowestNoteRight);
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
  ellipse(ballX, ballY, 20, 20);
  ballX += ballXSpeed;
  ballY += ballYSpeed;
  if (ballX > width || ballX < 0) {
    ballXSpeed *= -1;
  }
  if (ballY > height || ballY < 0) {
    ballYSpeed *= -1;
  }
}

onEnabled = () => {
  console.log('WebMidi enabled!');

  keyboard1 = WebMidi.getInputByName("KOMPLETE KONTROL M32").channels[1];
  keyboard2 = WebMidi.getInputByName("Launchkey MK3 49 LKMK3 MIDI Out").channels[1];

  WebMidi.inputs.forEach((device, index) => {
    console.log(`${index}: ${device.name}`);
  });
}

function getKeyboardRange() {
  keyboard1.addListener("noteon", e => {
    console.log(e.note.number);
    if (e.note.number > highestNoteRight) {
      highestNoteRight = e.note.number;
      console.log('new highest note: ' + highestNote);
    }
    if (e.note.number < lowestNoteRight) {
      lowestNoteRight = e.note.number;
      console.log('new lowest note: ' + lowestNote);
    }
  });

  keyboard2.addListener("noteon", e => {
    if (e.note.number > highestNoteLeft) {
      highestNoteLeft = e.note.number;
      console.log('new highest note: ' + highestNote);
    }
    if (e.note.number < lowestNoteLeft) {
      lowestNoteLeft = e.note.number;
      console.log('new lowest note: ' + lowestNote);
    }
  });
}