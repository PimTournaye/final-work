// Set arbirary note number to compare later
let lowestNote = 54;
let highestNote = 55;
let MIDI;

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

function draw() {
  background(220);
  getKeyboardRange();
  drawKeyboard();
  drawBall();
}

// draw the piano keyboard on the left and right sides of the screen for 60px, ranging from the lowest note to the highest note
function drawKeyboard() {
  let y = 0;
  let keyWidth = 60;
  let keyHeight = height / (highestNote - lowestNote);
  for (let i = lowestNote; i <= highestNote; i++) {
    let key = i;
    let keyColor = color(255);
    // check for black piano keys and change color in the range of the lowest note to the highest note
    if (key % 12 == 1 || key % 12 == 3 || key % 12 == 6 || key % 12 == 8 || key % 12 == 10) {
      keyColor = color(0);
    }
    MIDI.addListener("noteon", e => {
      if (e.note.number == key) {
        keyColor = color(255);
      }

    });
    // if a key is played on the connected MIDI device, draw the key as red
    
    fill(keyColor);
    rect(0, y, keyWidth, keyHeight);

    // change y position for next key
    y += keyHeight;
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
  MIDI = WebMidi.getInputByName("KOMPLETE KONTROL M32").channels[1];

}


function getKeyboardRange() {
  MIDI.addListener("noteon", e => {
    if (e.note.number > highestNote) {
      highestNote = e.note.number;
      console.log('new highest note: ' + highestNote);
    }
    if (e.note.number < lowestNote) {
      lowestNote = e.note.number;
      console.log('new lowest note: ' + lowestNote);
    }
  });
}