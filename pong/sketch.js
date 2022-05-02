// Set arbirary note number to compare later
let lowestNote = 54;
let highestNote = 55;
let MIDI;

function setup() {
  createCanvas(1200, 900);

  WebMidi
    .enable()
    .then(onEnabled)
    .catch(err => alert(err));
}

function draw() {
  background(220);
  getKeyboardRange();
  drawKeyboard();
}

// draw the piano keyboard on the left and right sides of the screen for 60px, ranging from the lowest note to the highest note
function drawKeyboard() {
  let y = 0;
  let keyWidth = 60;
  let keyHeight = height / (highestNote - lowestNote);
  console.log(lowestNote, highestNote);
  for (let i = lowestNote; i <= highestNote; i++) {
    let key = i;
    let keyColor = color(255);
    // check for black piano keys and change color in the range of the lowest note to the highest note
    if (key % 12 == 1 || key % 12 == 3 || key % 12 == 6 || key % 12 == 8 || key % 12 == 10) {
      keyColor = color(0);
    }
    
    fill(keyColor);
    rect(0, y, keyWidth, keyHeight);

    // change y position for next key
    y += keyHeight;
  }
}

onEnabled = () => {
  console.log('WebMidi enabled!');
  MIDI = WebMidi.getInputByName("KOMPLETE KONTROL M32").channels[1];

}


function getKeyboardRange() {
  MIDI.addListener("noteon", e => {
    console.log(e.note.number);
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