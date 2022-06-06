import express from "express";
import { createServer, get } from "http";
import { Server } from "socket.io";
import _ from "lodash";

import { config } from "./config.js";

import { readdirSync } from "fs";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static("public"));

let choices = makeNewChoices();

let images = [];
let usedImages = [];

let currectRound = 0;
let roundsToIntroduceGameOver = _.random(15, 24);;
let time;

/**
 * @route GET /
 * @desc Loads the index.html file
 */
app.get("/", (req, res) => {
  res.sendFile("../public/index.html");
});

/**
 * @route GET /band
 * @desc Loads the page for the band
 */
app.get("/band", (req, res) => {
  res.sendFile(__dirname + "/band.html");
});

/**
 * @route GET /start
 * @desc Starts the game
 */
app.get("/start", (req, res) => {

  io.emit("start");
  res.send("Started the timer");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  // send the client the following data: current choices, current timer, current round, show score choice time mark, max timer
  socket.emit("data", {
    choices: choices,
    timer: config.MAX_TIMER,
    showScoreChoiceTime: config.SHOW_SCORE_CHOICE_TIME,
    maxTimer: config.MAX_TIMER,
    round: 0,
    roundsToIntroduceGameOver: roundsToIntroduceGameOver,
  });


  socket.on("vote", (index) => {
    io.emit("vote", index);
    if (choices[index]) choices[index].votes++;
  });

  socket.on('start', () => {
    // Start the global timer
    makeTimer();
  });
});

// get all the images from the public folder and put them in an array, then shuffle the array
function getImages() {
  images = readdirSync("../public/img/Treatise");
  // add all the images to the array
  images = images.map((image) => {
    return `/images/Treatise/${image}`;
  });
  console.log(images);
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
    usedImages.push(image);
  }
  choices.push(...pages);

  // keep track of which images have already been used
  usedImages.push(...pages);
  return choices;
}

function updateChoices() {
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

// make a timer that counts down from 60 seconds, when it hits 0, it will emit a new round event to the client
function makeTimer() {
  time = config.MAX_TIMER;
  let interval = setInterval(() => {
    time--;
    socket.emit("update", getData());
    if (time <= 0) {
      clearInterval(interval);
      updateChoices();
      io.emit("new round");
      currectRound++;
    }
  }, 1000);
}

function getData() {
  let data = {
    choices: choices,
    timer: config.MAX_TIMER - time,
    round: currectRound,
    showScoreChoiceTime: config.SHOW_SCORE_CHOICE_TIME,
    maxTimer: config.MAX_TIMER,
  };

  return data;
}

function checkWinningVote() {
  let winner = _.maxBy(choices, "votes");
  let image = winner.image;
  if (image === "Game Over") {
    io.emit("game over");
    return;
  }
  return image;
}



httpServer.listen(config.PORT, () => {
  console.log(`listening on port ${config.PORT}`);
  // populate the images array
  getImages();
  io.emit('initial score', getInitialScore());
});