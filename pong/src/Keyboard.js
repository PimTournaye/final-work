import Paddle from "./Paddle";
import PianoKey from "./PianoKey";
import { inputs } from "./sketch";

export default class Keyboard {
  constructor(side, keys, inputChannel) {
    // Set a MIDI channel
    this.MIDI_CHANNEL = this.setMIDIchannel(inputChannel);
    // What side of the screen is this keyboard on?
    this.side = side;
    // Set the keys this keyboard has
    this.keys = keys;
    // Extra check to make sure the keys are filled before drawing
    this.filledKeys = false;

    // Range of the keyboard
    this.range;
    // Set the highest and lowest notes for this keyboard
    this.highestNote = keys.length - 1;
    this.lowestNote = keys[0];

    // Active / Played notes at this moment
    this.activeNotes = [];

    // Give the keyboard it's paddle
    this.paddleX = () => {
      if (this.side == 'left') {
        return 0;
      } else {
        return width - 60 - 10;
      }
    }
    // Make a Paddle object for this keyboard
    this.paddle = new Paddle(this.paddleX(), this.lowestNote, this.highestNote);
  }

  setMIDIchannel(input) {
    let channel = inputs[input].channels[1];
    return channel;
  }

  fillNotes() {
    this.keys = [];
    try {
      let keyWidth = 60;
      let keyHeight = height / (this.highestNote - this.lowestNote + 1);
      let x;
      let y = 0;
      if (this.side == 'left') {
        x = 0;
      } else x = width - keyWidth;

      for (let i = this.lowestNote; i <= this.highestNote; i++) {
        let currentNote = i;
        let newKey = new PianoKey(currentNote, x, y, keyWidth, keyHeight)

        // if newKey is already in the array, don't add it again
        if (this.keys.includes(newKey)) {
          continue;
        } else {
          this.keys.push(newKey);
        }
        y += keyHeight;
      }
      this.filledKeys = true;
    } catch (error) {
      console.log(error)
    }
  }

  getActiveNotes() {
    // if MIDI is not connected, stop this function
    if (this.MIDI_CHANNEL == undefined) {
      return;
    }
    try {
      this.MIDI_CHANNEL.addListener("noteon", e => {
        let newNote = e.note;
        // Extra check to see if the note has stopped in case the MIDI device doesn't send noteoff messages
        if (newNote.rawAttack == 0) {
          return;
        }
        if (this.activeNotes.length !== 0) {
          let keyFound = this.findKey(newNote);
          if (keyFound) {
            return;
          }
        }
        // match newNote with a PianoKey in this.keys and add that to active notes
        let k = this.keys.find(key => new String(key.noteName).valueOf() == new String(newNote.identifier).valueOf());
        if (k) {
          this.activeNotes.push(k);
        }
        this.MIDI_CHANNEL.addListener("noteoff", e => {
          let noteOff = e.note;
          //remove the PianoKey from the activeNotes array if it match the noteNumber of the PianoKey
          this.activeNotes = this.activeNotes.filter(note => note.noteName !== noteOff.identifier);
      });
    });
    } catch (error) {
      console.log(error);
    }
  }

  findKey(note) {

    let found = false;
    console.log(this.activeNotes, note);
    for (let i = 0; i < this.activeNotes.length; i++) {
      if (this.activeNotes[i].noteName == note.identifier) {
        found = true;
        break;
      }
    }
    return found;
  }


  getRange() {
    try {
      this.MIDI_CHANNEL.addListener("noteon", e => {
        if (e.note.number > this.highestNote) {
          this.highestNote = e.note.number;
        }
        if (e.note.number < this.lowestNote) {
          this.lowestNote = e.note.number;
        }
      });
      this.range = this.highestNote - this.lowestNote + 1;
    } catch (error) {
      console.log(error);
    }
  }

  drawKeys() {
    if (!this.filledKeys) {
      return;
    } else if (this.keys.length <= 2) {
      return;
    }
    this.keys.forEach(key => {
      key.draw();
    });
  }

  updatePaddle() {
    // If there are no active notes, stop this function
    if (this.activeNotes.length == 0) {
      return;
    }
    // get the lowest and highest notes in the activeNotes array
    let lowestActiveNote = this.activeNotes.reduce((prev, curr) => prev.noteNumber < curr.noteNumber ? prev : curr);
    let highestActiveNote = this.activeNotes.reduce((prev, curr) => (prev.noteNumber > curr.noteNumber) ? prev : curr);

    let coords = {
      lowest: lowestActiveNote.y,
      highest: highestActiveNote.y,
    }

    console.log(coords);
    
    this.paddle.update(coords.lowest, coords.highest - coords.lowest);
    this.paddle.draw()
  }

  displayActiveNotes() {
    fill(255, 0, 255);
    textSize(32);
    let html = '';
    let theDiv = document.getElementsByTagName('div')[0];
    for (let i = 0; i < this.activeNotes.length; i++) {
      html += `${this.activeNotes[i].noteName}, `;
    }
    theDiv.innerHTML = html;
  }

  update() {
    this.getRange();
    this.fillNotes();
    this.drawKeys();
    this.getActiveNotes();
    this.displayActiveNotes();
    this.updatePaddle();
  }
}