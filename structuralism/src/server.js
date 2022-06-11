import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import _ from "lodash";

import { config } from "./config.js";

import { readdirSync } from "fs";
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(express.static(path.join(__dirname, "../public")));
const httpServer = createServer(app);
const io = new Server(httpServer);

let choices = [];
let images = [];
let usedImages = [];

let currectRound = 0;
let roundsToIntroduceGameOver = _.random(15, 24);;
let time = config.MAX_TIMER;

let started = false;

let initial;

/**
 * @route GET /
 * @desc Loads the index.html file
 */
app.get("/", (req, res) => {
  res.sendFile("index.html", { root: path.join(__dirname, "../public") });
});

/**
 * @route GET /band
 * @desc Loads the page for the band
 */
app.get("/band", (req, res) => {
  console.log('sending band page');
  res.sendFile("band.html", { root: path.join(__dirname, "../public") });
});

/**
 * @route POST /start
 * @desc Starts the game
 */
app.post("/start", (req, res) => {
  res.send("Started the timer");
  console.log("Started the timer");
  if (!started) {
    started = true;
    io.emit("start");
  } else res.send("Game is already started");
});

app.get("/initial", (req, res) => {
  res.json({ image: initial }).status(200);
});

io.on("connection", (socket) => {
  console.log("a user connected - ", socket.id);

  io.emit("update", getData());


  socket.on('start', () => {

    // start the round
    socket.broadcast.emit("new-round-public", () => {

      console.log("new round emitted");
      getData(time);

    });

    // make a timer that counts down from 60 seconds, when it hits 0, it will emit a new round event to the client
    time = config.MAX_TIMER;
    let interval = setInterval(() => {
      console.log('timer ticked');
      time--;
      if (time <= 0) {
        // stop the interval
        clearInterval(interval);
        // Increment round number
        currectRound++;
        // Get new round ready
        updateChoices();
        // Check the votes
        //let image = checkWinningVote();
        // Emit image to band client
        //socket.broadcast.emit("new-round-band", image);
  
        // Emit new round
        socket.broadcast.emit("new-round-public", getData(time));
  
        console.log('new round started');
      }
      if (started) {
        // restart the timer
      }
      socket.broadcast.emit("update", getData());
    }, 1000);
  });

  socket.on("vote", (index) => {
    console.log("vote received - option " + index);
    io.emit("vote", index);
    if (choices[index]) choices[index].votes++;
  });
});

// get all the images from the public folder and put them in an array, then shuffle the array
async function getImages() {
  let loadImages = readdirSync("../public/img/Treatise");
  // add all the images to the array
  images = loadImages.map((image) => {
    return `./img/Treatise/${image}`;
  });
  // shuffle the array
  images = _.shuffle(images);
}

function getInitialScore() {
  let score = _.sample(images);
  usedImages.push(score);
  return score;
}

function checkForUsedImages(image) {
  for (let i = 0; i < usedImages.length; i++) {
    if (usedImages[i] === image) {
      return true;
    }
  }
  return false;
}

// function to fill choices with the images
async function makeNewChoices() {
  let choices = [];
  let pages = _.sampleSize(images, 4)
  // if the image is already used, get a new one that hasn't been used and check again if it's already used, keep doing this until you get a new unused image
  for (let i = 0; i < pages.length; i++) {
    let image = pages[i];
    if (checkForUsedImages(image)) {
      image = _.sample(images);
      while (checkForUsedImages(image)) {
        image = _.sample(images);
      }
    }
    choices[i] = {
      image: image,
      votes: 0
    }
    // add the new image to the used images array so it won't get used again later
    usedImages.push(image);
  }
  // keep track of which images have already been used
  usedImages.push(...pages);

  return choices;
}

async function updateChoices() {
  let newChoices = await makeNewChoices();
  choices = {
    0: { image: newChoices[0], votes: 0 },
    1: { image: newChoices[1], votes: 0 },
    2: { image: newChoices[2], votes: 0 },
    3: { image: newChoices[3], votes: 0 },
  }
  // if the current round is greater than the number of rounds to introduce the game over, then add the game over image to the choices
  if (currectRound >= roundsToIntroduceGameOver) {
    let gameOverImage = {
      image: "Game Over",
      votes: 0
    }
    Object.assign(choices, { 4: gameOverImage });
  }
}

function getData() {
  let data = {
    choices: choices,
    timer: config.MAX_TIMER - time,
    round: currectRound,
    showScoreChoiceTime: config.SHOW_SCORE_CHOICE_TIMEMARK,
    roundsToIntroduceGameOver: roundsToIntroduceGameOver,
    maxTimer: config.MAX_TIMER,
  };
  return data;
}

function checkWinningVote() {
  const winner = _.maxBy(choices, "votes");
  const image = winner.image;
  if (image === "Game Over") {
    io.emit("game over");
    started = false;
    return;
  }
  return image;
}

httpServer.listen(config.PORT, async () => {
  console.log(`listening on port ${config.PORT}`);
  // populate the images array
  await getImages();
  choices = await makeNewChoices();
  initial = getInitialScore();
});