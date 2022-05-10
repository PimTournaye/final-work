class Keyboard {
    constructor(side, keys, MIDI_CHANNEL) {
        this.MIDI_CHANNEL = MIDI_CHANNEL;

        this.keys = keys;
        this.side = side;
        this.highestNote = keys.length - 1;
        this.lowestNote = keys[0];
        this.paddle;
    }
}