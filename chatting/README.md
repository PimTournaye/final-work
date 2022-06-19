# Chatting with drums

CONCEPT CONCEPT CONCEPT

## Requirements
- Node.js
- NPM
- Arduino Uno
- Two piezo sensors along with two 1M Ω resistors
- A button, preferebly an end-stop button
- Platform.io IDE or Arduino IDE
- A drum kit
- At least one of [Sunhouse's Sensory Percussion](https://sunhou.se/sensorypercussion/) triggers and their sampler software

## Setup
The process of setting up this project is a little involved, so please follow the steps closely, and take your time to make sure everthing works properly.

### Drum setup
Start setting up your SP triggers following the [Sensory Percussion setup guide](https://help.sunhou.se/). Feel free to train the parts of the drums you will use, or more. We'll be coming bakc here later.

Build the schematic included in the Platform.io folder to get your Arduino up and running. Put the piezo sensors on the part of the drum you want them to pick up, along with the button or end-stop switch (which I recommend put beneath one of the drum's pedals.)
Next, after the piezo's have been integrated into the drum kit, take your time playing around with their threshold values, making sure they trigger in a way you want them to. The variables are listened at the top of the `main.cpp` file. To test, adjust the values, build and then upload with Platform.io IDE or Arduino IDE

### Server setup
Run `npm install` or `pnpm install` to install the necessary node modules for the server.

Next, take a look at `src/keys.js` and decide which MIDI notes you want triggering which set of characters. Once you have decided on the MIDI notes, reopen the Sensory Percussion software and assign those MIDI notes to the parts of the drum you want to use.
To run the server, please run the `npm run start` command.

## Usage
Once everything is up and running, start exploring making some phrases with the drums, it takes some getting used to. As it stands in the prototype, the parts of kit that are extended are the kick drum (to add a space), the hi hat pedal (to delete characters) and a crash cymbal (to send your message to the chatroom).

Really play around with the delete button, as it allows you to still play around a bit while not being completely restrained for the typing system. Try to keep your phrasing musical, and be creative with omitting characters to still form coherent messages

The public can access the HTML page in the `public` folder to open a chatroom of their own. 