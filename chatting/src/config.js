export const config = { 
    MIDI_INSTRUMENT_NAME: 'IAC Driver Bus 1',
    //MIDI_INSTRUMENT_NAME: 'Launchkey MK3 49 LKMK3 MIDI Out',
    KEYPAD_TIMER_DELAY: 1000,

    // Arduino stuff
    //SERIAL_PORT_PATH: 'COM3',
    SERIAL_PORT_PATH: '/dev/cu.usbmodem212201',
    BAUD_RATE: 9600,
    // Message string appearing in serial port from Arduino
    CRASH_MESSAGE: 'Crash!',
    HIHAT_MESSAGE: 'HiHat!',
    KICK_MESSAGE: 'Kick!',
}