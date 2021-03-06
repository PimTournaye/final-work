// Local imports
import { config } from './config.js'
import { keysValues, numberValues } from './keys.js';

// Serialport initialization for Arduino
import { SerialPort } from 'serialport'
import { ReadlineParser } from '@serialport/parser-readline'

// Socket.io for communication and network
import { Server } from "socket.io";

// Web MIDI API for Node.js
import { WebMidi } from 'webmidi'


// Socket.io initialization
const SOCKET_PORT = 3000;
import { createServer } from "http";

const httpServer = createServer();
const io = new Server(httpServer, {
  // ...
});

io.on('connection', (socket) => {
  console.log('a user connected');
  socket.on('chat message', (msg) => {
    console.log('chat message', msg);
  });
});

httpServer.listen(SOCKET_PORT || 3000, () => {
  console.log("Server launched on port " + SOCKET_PORT);
});

// Automatically grab the correct serialport from available devices
// Borrowed and then tweaked from https://dev.to/azzamjiul/how-to-connect-to-arduino-automatically-using-serial-port-in-nodejs-plh
let serialPath = ''
let port;

SerialPort.list().then(ports => {
  let done = false;
  let count = 0;
  let allports = ports.length;
  ports.forEach((port) => {
    count++
    let pm = port.manufacturer;
    console.log(port);
    if (typeof pm !== 'undefined' && pm.includes('arduino')) {
      serialPath = port.path;
      done = true;
    }
    if (count === allports && done === false) {
      console.log(`Can't find Arduino`);
    }
  })
  port = new SerialPort({ path: serialPath, baudRate: config.BAUD_RATE }, (err) => {
    if (err) {
      return console.log('Serialport error: ', err.message)
    }
  })
  const parser = new ReadlineParser();
  port.pipe(parser); // pipe the serial stream to the parser

  port.on('open', showPortOpen);
  parser.on('data', readSerialData);
  port.on('close', showPortClose);
  port.on('error', showError);

  function showPortOpen() {
    console.log('Serialport open. Data rate: ' + port.baudRate);
  }

  // Read the data from the serial port and act accordingly
  function readSerialData(data) {
    console.log('Raw serial data: ', data);
    // remove any '\r' characters from the data, since the serialport library adds these
    data = data.replace(/\r/g, '');
    switch (data) {
      // Send the message on crash cymbal hit
      case config.CRASH_MESSAGE:
        sendMessage();
        tracker.counter = 0;
        console.log('detected crash');
        break;
      // Remove the last character from the input on hihats cymbals closing
      case config.HIHAT_MESSAGE:
        message = message.slice(0, -1);
        console.log("detected hihat");
        break;
      // Insert a space into the message / input box when playing the kick drum
      case config.KICK_MESSAGE:
        message += ' ';
        console.log("detected kick");
        break;
      // default:
      //   console.log('No match with serial data');
      //   break;
    }
  }

  function showPortClose() {
    console.log('port closed.');
  }

  function showError(error) {
    console.log('Serial port error: ' + error);
  }
});

// MIDI initialization
let MIDI;
WebMidi.enable()
  .then(() => {
    console.log('WebMidi enabled!');
    const INPUT = WebMidi.getInputByName(config.MIDI_INSTRUMENT_NAME);
    MIDI = INPUT.channels[1];

    MIDIKeyPad();
  })
  .catch(err => console.log(err));


/**
 * Sends a message to the chat room through the socket.io server.
 * @param {*} event 
 */
let sendMessage = (socket) => {
  if (message.length !== 0) {
    console.log('Sending message: ', message);
    socket.emit('chat message', message);
    message = '';
  } else console.log('No message to send');
}

///////////////
// Main Loop //
///////////////

// Init empty string for building messages
let message = ''

// Timestamps and counter for key presses
let tracker = {
  time: null,
  counter: null
}

function MIDIKeyPad() {
  // One big object with all the keys of the keypad 
  const padValues = [...keysValues, ...numberValues];

  // Variables to make a message with
  let characters;

  // Note variables for tracking
  let note = {
    previous: '',
    current: '',
  }

  // MIDI event listeners
  MIDI.addListener('noteoff', (e) => {
    // Maybe do something here, probably not necessary
  });

  MIDI.addListener('noteon', (e) => {
    // Get the note as a string, eg. 'C3'
    note.current = e.note.identifier;
    // Match note with a padValues.MIDI key in the padValues object to get that key's characters
    characters = padValues.find(padValue => padValue.MIDI == note.current);
    // If the note is different from the previous note, reset the counter
    if (note.current !== note.previous) {
      console.log("New note");
      // Reset the counter since there is a different 'key' being used
      tracker.counter = 0;
      // Restart the timer to track it
      tracker.time = Date.now();
    }
    if (note.current === note.previous) {
      console.log("Same note as previous");
      const timecheck = Date.now();
      // if the difference between the current time and the previous time is less than the delay, increment the counter
      if (timecheck - tracker.time < config.KEYPAD_TIMER_DELAY) {
        console.log('within timer delay');
        // Increment the counter
        tracker.counter++;
        if (tracker.counter > characters.value.length) tracker.counter = 0;
        // Reset our timer
        tracker.time = Date.now();
        // extra check to make it doesn't remove more characters than needed
        if (tracker.counter !== 0) {
          // Remove the last character from the our message so we can replace it
          message = message.slice(0, -1);
        }
      } else {
        console.log('not within timer delay');
        // Reset the counter and timer to start anew
        tracker.counter = 0;
        // Reset our timer
        tracker.time = Date.now();
      }
    }
    // If the padValue is found, add the character to the message string
    if (typeof characters != 'undefined' || characters != null) {
      // Add the needed character padValue to the message string
      let character = characters.value.charAt(tracker.counter);
      console.log(character);
      message += character;
    } else console.log("Note not recognized or mapped", note.current);

    // Set the previous note to the current note
    note.previous = note.current
    console.log('Message: ', message);
    console.log("Counter:", tracker.counter);
  });
}