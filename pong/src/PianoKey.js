import { Note } from '@tonaljs/tonal'

export default class PianoKey {
    constructor(note, x, y, width, height) {
        this.noteNumber = note;
        this.noteName = this.getNoteName(note);
        this.color = this.isBlack();
        this.x = x;
        this.y = y;
        this.height = height;
        this.width = width;
        this.active = false;
    }

    /**
     * This draws the key on the screen along with it's correct color. IF the key is active, it will be drawn as red
     * @returns {void} nothing
     */
    draw() {
        // check if the key is active, if so, draw it as red
        if (this.active) {
            fill(255, 0, 0);
        } else {
        fill(this.color);
        }
        rect(this.x, this.y, this.width, this.height);
    }

    /**
     * Check whether the note is black or white, depending on the note's MIDI number
     * @returns {number} a greyscale value from 0-255
     */
    isBlack() {
        if (this.noteNumber % 12 == 1 || this.noteNumber % 12 == 3 || this.noteNumber % 12 == 6 || this.noteNumber % 12 == 8 || this.noteNumber % 12 == 10) {
            return 0;
        } else {
            return 255;
        }
    }

    /**
     * Convert the this PianoKey's MIDI note number to a note name (e.g. C#4)
     * @param {number} noteNumber the MIDI number of the note
     * @returns {string} the note name with the correct octave and accidental converted to sharps
     */
    getNoteName(note) {
        return Note.fromMidiSharps(note);
    }

}