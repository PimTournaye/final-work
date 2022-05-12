import { Note } from '@tonaljs/tonal'

export default class PianoKey {
    constructor(note, x, y, height) {
        this.noteNumber = note;
        this.noteName = this.getNoteName(note);
        this.color = this.isBlack();
        this.x = x;
        this.y = y;
        this.height = height;
    }

    /**
     * This draws the key on the screen
     */
    draw() {
        fill(this.isBlack());
        rect(this.x, this.y, this.height, this.height);
    }

    // check whether the key is white or black
    isBlack() {
        if (this.noteNumber % 12 == 1 || this.noteNumber % 12 == 3 || this.noteNumber % 12 == 6 || this.noteNumber % 12 == 8 || this.noteNumber % 12 == 10) {
            return 0;
        } else {
            return 255;
        }
    }

    // convert MIDI number to note name using Tonal.js
    getNoteName(note) {
        return Note.fromMidi(note);
    }

}