// Local imports
import { config } from './config'
import { keysValues, numberValues } from './keys'

// Serialport initialization for Arduino
import { SerialPort } from 'serialport'
const port = new SerialPort({ path: config.SERIAL_PORT_PATH, baudRate: config.BAUD_RATE }, function (err) {
  if (err) {
    return console.log('Serialport error: ', err.message)
  }
})

// Socket.io initialization
import { Server } from "socket.io";
const SOCKET_PORT = 3000;
let io = new Server(SOCKET_PORT);

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat message', (msg) => {
    console.log('chat message', msg);
  });
});

// MIDI initialization
import { WebMidi } from 'webmidi'
let MIDI_DEVICE;
WebMidi.enable()
  .then(() => {
    console.log('WebMidi enabled!');
    const INPUT = WebMidi.getInputByName(config.MIDI_INSTRUMENT_NAME);
    MIDI_DEVICE = INPUT.channels[1];
  })
  .catch(err => console.log(err));

/**
 * Sends a message to the chat room through the socket.io server.
 * @param {*} event 
 */
let sendMessage = () => {
  if (message.length != 0) {
    socket.emit('chat message', message);
    message = '';
  } else console.log('No message to send');
}


///////////////
// Main Loop //
///////////////
function MIDIKeyPad() {
  // One big object with all the keys of the keypad 
  const padValues = [...keysValues, ...numberValues];
  // Timer variables
  let time = { start: 0, end: 0 };
  let timerOver = false;

  // Variables to make a message with
  let message = '';

  // Note variables
  let note = {
    previous: '',
    current: '',
  }
  // Counter for keeping track of represses of a key
  let counter = 0;

  // MIDI event listeners
  MIDI.addListener('noteon', (e) => {
    time.start = Date.now();
  });

  MIDI.addListener('noteoff', (e) => {
    // Timer for keypad
    time.end = Date.now();
    // Get the note as a string, eg. 'C3'
    note.current = e.note.identifier;

    // If the difference between the start and end time is greater than the timer delay, set the timerOver to true and reset the counter
    if (time.end - time.start > config.KEYPAD_TIMER_DELAY) {
      timerOver = true;
      counter = 0;
    } else timerOver = false;

    // If the timer is over, proceed as normal
    if (timerOver) {
      // Match note with a padValues.MIDI key in the padValues object
      const characters = padValues.find(padValue => padValue.MIDI === note);
      // If the padValue is found, add the character to the message string
      if (padValue) {
        // Add the needed character padValue to the message string
        let character = characters.charAt(counter);
        message += character;
      } else console.log('There was an error with the noteoff event', e.note);
    // If the note is the same as the previous note, it's a repress, which increments the counter
    } else if (note.current === note.previous && timerOver == false) {
      counter++;
      // If the counter is greater than the length of the character, reset the counter
      if (counter > characters.length) counter = 0;
      // Remove the last character from the message string and replace it with charAt(counter)
      message = message.slice(0, -1)
      let newCharacter = characters.find(padValue => padValue.MIDI === note).charAt(counter);
      message += newCharacter;
    }



    // Match note with a padValues.MIDI key in the padValues object
    const padValue = padValues.find(padValue => padValue.MIDI === note);

    if (padValue) {
      // Add the first character padValue to the message
      message += padValue.charAt(counter);
    } else console.log('There was an error with the noteoff event', e.note);



    note.previous = note.current
  });


  // Reading from the Arduino
  port.on('data', (data) => {
    console.log('Data: ', data);
    switch (data) {
      // Send the message on crash cymbal hit
      case config.CRASH_MESSAGE:
        sendMessage();
        counter = 0;
        break;
      // Remove the last character from the input on hihats cymbals closing
      case config.HIHAT_MESSAGE:
        message = message.slice(0, -1);
      // Insert a space into the message / input box when playing the kick drum
      case config.KICK_MESSAGE:
        message += ' ';
      default:
        console.log('No match');
        break;
    }
  });
}
