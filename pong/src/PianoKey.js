export default class PianoKey {
    constructor(note) {
        this.note = this.getNoteName(note);
        this.color = this.isBlack();
    }

    // draw this key
    draw() {
        fill(this.color);
        rect(0, 0, 60, height / (highestNote - lowestNote + 1));
    }

    // check whether the key is white or black
    isBlack() {
        if (this.note % 12 == 1 || this.note % 12 == 3 || this.note % 12 == 6 || this.note % 12 == 8 || this.note % 12 == 10) {
            return 0;
        } else {
            return 255;
        }
    }

    // convert MIDI number to note name using Tonal.js
    getNoteName(note) {
        return Tonal.Note.fromMidi(note);
    }



}