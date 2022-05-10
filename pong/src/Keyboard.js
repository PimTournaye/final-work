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

    this.keys = this.fillNotes();
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
    console.log(inputs[input].channels[1]);
    let channel = inputs[input].channels[1];   
    return channel;
  }

  fillNotes() {
    try {
      let keyWidth = 60;
      let keyHeight = height / (this.highestNote - this.lowestNote + 1);
      let x;
      if (this.side == 'left') {
        x = 0;
      } else x = width - keyWidth;
      for (let i = this.lowestNote; i <= this.highestNote; i++) {
        let currentNote = i;
        this.keys.push(new PianoKey(currentNote, x, y, keyHeight))

        // change y position for next key
        y += keyHeight;
      }
    } catch (error) {

    }
  }

  getActiveNotes() {
    // if MIDI is not connected, stop this function
    if (this.MIDI_CHANNEL == undefined) {
      return;
    }
    // Try catch to make sure the MIDI device is connected, or to compensate for timing or syncing issues
    try {
      this.MIDI_CHANNEL.addListener("noteon", e => {
        // if the e.note.rawAttack is 0 (note velocity), remove it from the array to be sure in case noteoff doesn't work
        if (e.note.rawAttack == 0) {
          activeNotes = activeNotes.filter(note => note != e.note.number);
        } else if (activeNotes.includes(e.note.number)) {
          return;
        } else {
          activeNotes.push(e.note.number);
        }
      });
      this.MIDI_CHANNEL.addListener("noteoff", e => {
        activeNotes.splice(activeNotes.indexOf(e.note.number), 1);
      });
      return activeNotes;

    } catch (error) {
      console.log(error);
    }
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
    } catch (error) {
      console.log(error);
    }
    // Update the range of the keyboard
    this.range = this.highestNote - this.lowestNote + 1;
  }

  drawKeys() {
    if (this.keys.length == 0) {
      return;
    }
    console.log(this.keys);
    this.keys.forEach(key => {
      console.log(key);
      key.draw();
    });
  }

  updatePaddle() {
    // If there are no active notes, stop this function
    if (this.activeNotes.length == 0) {
      return;
    }
    //this.paddle().update();
  }


  update() {
    console.log(this);
    this.getRange();
    this.getActiveNotes();
    this.drawKeys()
    this.updatePaddle();
  }
}