# PONG

This a prototpye for a [game piece](https://en.wikipedia.org/wiki/Game_piece_(music)) based on the classic retro video game, Pong.

It's partly a p5 sketch and partly an Arduino sketch on a ESP32. The p5 sketch takes care of handling MIDI devices and events, along with drawing anything needed to play the pong game. The ESP32 controller has functionality to increase the speed of the Pong ball, and four other potentiometer to send out volume data (but it can be replaced to something else that can suit your needs.)

## Requirements

- Two MIDI Keyboards
- [ESP32 Feather](https://www.adafruit.com/product/3405) by Adafruit
- Node.js (at least 12.x)
- NPM
- Platfrom.io for uploading and compiling the Arduino sketch for the ESP32.

## Setup

Run `npm install` or `pnpm install` to install the necessary node modules.

Modify the values in `config.js` to your liking, and make sure the two `MIDI_INSTRUMENT` values match the names of your MIDI keyboards.

If you want to use a different ESP32 model, please reconfigure the project in the Platform IO IDE to use your chosen model. Please also check the `main.cpp` file to reconfigure your network settings. Change the following values to match yours:
  
- Network name
- Network password
- Socket.io Port
- Socket.io network address

## Running the prototype
Make sure your two MIDI keybords are plugged in before starting the game.

You can start the game by running `npm run dev` in your terminal. Vite will launch an HTTP Server on the localhost address, running on port 3000. 

If you are using the EPS32, please instruct your audience what each potentiometer does, or don't to keep it a surprise.

Once you open the link provided by Vite, the game will begin immediately. Play the highest and lowest keys of your MIDI keyboards to get them to draw properly. If you want to use the octave buttons, the program will draw the addition octave(s) but still not take anything away. Use it at your own risk.

## How to play / Guidelines

The goal of this game piece is try to bounce the ball back and forth while staying musical with the entire band. If using an ESP32 controller, they will be able to control certain parameters, be it musician volume or speed of the game.

The two keyboard players are able to bounce back and forth by creating a paddle on their side of the screen. You can create a paddle on your side of the screen by playing at least two notes at the smae time. The paddle will then stretch from the lowest played note to the highest played note.

Something you could try to play around with the ball. Change up the style or way you play based on the movement and speed of the ball, for example: if the ball is moving slowly, try to play a melody that follows the path of ball. Or if the ball is moving very fast, try to focus on plauing broad interesting chords 

There is no winstate for this game, feel free to quit at your own leasure.