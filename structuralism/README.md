# Blocks & Structuralism
This prototype takes a band and an audience through the graphic score "Treatise" by Cornelius Cardew. The band will get a random page from the score and will call to start the game. 

After a set amount of time all audience members will get four random pages to choice from. They can cast their vote for their chosen page and the one with the most votes becomes the next page for the band to play after the current round has passed.

After a set amount of rounds, the audience also gets to option to vote for the piece to end. 

## Requirements
- Node.js
- NPM
- An accesible network or wireless connection

## Setup
Run `npm install` or `pnpm install` to install the necessary node modules.

Take a look at `src/config.js` to see if you would like to adjust any parameters. By default, the server is listening on port 2000.

To run the server, please run `npm run start`.

## Usage
The server is using Express to process all information. There are two paths:

Entering the URL of the Express server followed by `/` will bring you to the audiance page, and `/band` will bring you to the band's page.

To initialize the game, the band has to go to their URL and press the `START` button, which will immediately start the game.

Depending on the configured interval, the audience gets four choices each round, for which they can vote by pressing the `VOTE` button. Every audience members only gets a single vote per round, and that vote cannot be reversed once cast, so take your time choosing.

Both parties have a timer to see how far they're into the current round at the top of the page.

Once the game ends, restart the server to begin a new game, this will reset all the neccesarry information.