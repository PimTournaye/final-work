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
    // set a standard key width for drawing individual PianoKey objects
    this.keyWidth = 60;
    // set a standard paddle width for drawing the paddle
    this.paddleWidth = 10;

    // Range of the keyboard
    this.range;
    // Set the highest and lowest notes for this keyboard
    this.highestNote = keys.length - 1;
    this.lowestNote = keys[0];

    // Active / played notes at this moment
    this.activeNotes = [];

    // Set the X coordinate for the paddle depending on which side of the screen the keyboard is on
    this.paddleX = () => {
      if (this.side == 'left') return 0 + this.keyWidth;
      else return width - this.keyWidth - this.paddleWidth;
    }
    // Make a Paddle object for this keyboard
    this.paddle = new Paddle(this.paddleX(), this.paddleWidth, this.lowestNote, this.highestNote);
  }

  /**
   * Sets up the MIDI channel for this Keyboard object
   * @param {WebMidi.MIDIInput} WebMidi.getInputBy name, ID, or other methods
   * @returns {WebMidi.MIDIInput} A WebMidi input channel to play and read midi messages from
   */
  setMIDIchannel(input) {
    let channel = inputs[input].channels[1];
    return channel;
  }

  /**
   * Fill the keys array with PianoKey objects
   * @returns {void} nothing
   */
  fillNotes() {
    this.keys = [];
    try {
      let keyHeight = height / (this.highestNote - this.lowestNote + 1);
      let x;
      let y = 0;
      if (this.side == 'left') {
        x = 0;
      } else x = width - this.keyWidth;

      for (let i = this.lowestNote; i <= this.highestNote; i++) {
        let currentNote = i;
        let newKey = new PianoKey(currentNote, x, y, this.keyWidth, keyHeight)

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

  /**
   * Reads the midi messages from the input channel and adds the notes to the activeNotes array
   * @returns {void} nothing
   */
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

  /**
   * Checks if a PianoKey is in the activeNotes array
   * @param {WebMidi.Note} note 
   * @returns {boolean} true if the given note is already in the this.activeNotes array
   */
  findKey(note) {
    let found = false;
    for (let i = 0; i < this.activeNotes.length; i++) {
      if (this.activeNotes[i].noteName == note.identifier) {
        found = true;
        break;
      }
    }
    return found;
  }

  /**
   * Get the range of the keyboard, based on the lowest and highest notes in the keys array
   * @returns {void} nothing
   */
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

  /**
   * Draws a PianoKey object to the screen for each element in the keys array
   * @returns {void} nothing
   */
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

  /**
   * Draws the paddle to the screen based on the notes in the activeNotes array
   * @returns {void} nothing
   */
  handlePaddle() {
    // If there are no active notes, stop this function
    if (this.activeNotes.length <= 1) {
      // putting paddle out of bounds to be sure nothing funky happens
      this.paddle.active = false;
      return;
    }
    // get the lowest and highest notes in the activeNotes array
    let lowestActiveNote = this.activeNotes.reduce((prev, curr) => prev.noteNumber < curr.noteNumber ? prev : curr);
    let highestActiveNote = this.activeNotes.reduce((prev, curr) => prev.noteNumber > curr.noteNumber ? prev : curr);

    let coords = {
      lowest: lowestActiveNote.y,
      highest: highestActiveNote.y + highestActiveNote.height, // add the height of the key to the y coordinate as to cover the last key
    }

    this.paddle.updateRect(coords.lowest, coords.highest - coords.lowest);
    this.paddle.draw()
  }
  // This is for debugging purposes
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

  /**
   * Updates the entire Keyboard object
   * @returns {void} nothing
   */
  update() {
    this.getRange();
    this.fillNotes();
    this.drawKeys();
    this.getActiveNotes();
    this.displayActiveNotes();
    this.handlePaddle();
  }
}