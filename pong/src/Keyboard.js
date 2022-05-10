export default class Keyboard {
  constructor(side, keys, MIDI_CHANNEL) {
    // Set a MIDI channel
    this.MIDI_CHANNEL = MIDI_CHANNEL;
    // What side of the screen is this keyboard on?
    this.side = side;
    // Set the keys this keyboard has
    this.keys = keys;
    // Set the highest and lowest notes for this keyboard
    this.highestNote = keys.length - 1;
    this.lowestNote = keys[0];

    // Active / Played notes at this moment
    this.activeNotes = [];

    // Give the keyboard it's paddle
    this.paddle = () => {
      if (this.side == 'left') {
        return new Paddle(0, height / 2, 10, height / 2);
      } else {
        return new Paddle(width - 10, height / 2, 10, height / 2);
      }
    }
  }

  getActiveNotes() {
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
  }

  updatePaddle() {
    this.paddle().update();
  }
}