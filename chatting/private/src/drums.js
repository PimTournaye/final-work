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
import { io } from "socket.io-client";
let socket = io();

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

// DOM elements
let input = document.getElementById('input');
let messages = document.getElementById('messages');


/**
 * Sends a message to the chat room through the socket.io server.
 * @param {*} event 
 */
let sendMessage = () => {
  if (input.value) {
    socket.emit('chat message', input.value);
    input.value = '';
  } else console.log('No message to send');
}

// Getting other users' messages through the socket.io server
socket.on('chat message', function (msg) {
  let item = document.createElement('li');
  item.textContent = msg;
  messages.appendChild(item);
  window.scrollTo(0, document.body.scrollHeight);
});

///////////////
// Main Loop //
///////////////
function MIDIKeyPad({ setText, text }) {
  // One big object with all the keys of the keypad 
  const padValues = [...keysValues, ...numberValues];
  // Timer variables
  let time = { start: 0, end: 0 };
  let timer;

  // MIDI event listeners
  MIDI.addListener('noteon', (e) => {

  });

  MIDI.addListener('noteoff', (e) => {
    // Get the note as a string, eg. 'C3'
    const note = e.note.identifier;
    // Variable to make messages with
    let message = '';

    // Match note with a padValues.MIDI key in the padValues object
    const padValue = padValues.find(padValue => padValue.MIDI === note);
    // If the padValue is found, send the value to the chat room
    if (padValue) {
      // Add the first character padValue to the message
      message += padValue.value[0];
    } else console.log('There was an error with the noteoff event', e.note);
  });


  // Reading from the Arduino
  port.on('data', (data) => {
    console.log('Data: ', data);
    switch (data) {
      // Send the message on crash cymbal hit
      case config.CRASH_MESSAGE:
        sendMessage();
        break;
      // Remove the last character from the input on hihats cymbals closing
      case config.HIHAT_MESSAGE:
        input.value = input.value.slice(0, -1);
      // Insert a space into the message / input box when playing the kick drum
      case config.KICK_MESSAGE:
        input.value += ' ';
      default:
        console.log('No match');
        break;
    }
  });
}
