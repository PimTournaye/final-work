import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import _ from "lodash";

import { config } from "./config.js";

import { readdirSync } from "fs";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static("public"));

let choices = {
  0: {image: "", votes: 0},
  1: {image: "", votes: 0},
  2: {image: "", votes: 0},
  3: {image: "", votes: 0},
};

/**
 * @route GET /
 * @desc Loads the index.html file
 */
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

/**
 * @route GET /band
 * @desc Loads the page for the band
 */
app.get("/band", (req, res) => {
  res.sendFile(__dirname + "/band.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("vote", (index) => {
    io.emit("vote", index);

    if (choices[index]) {
      choices[index].votes++;
    }
  });

  socket.on("reset", () => {
    io.emit("reset");
  });

  socket.on("update", () => {

    io.emit("update", choices);
    

    io.emit('new score', (newScore) => {

    })
  });
});

// get all the images from the public folder and put them in an array, then shuffle the array
function getImages() {
    let images = readdirSync("../public/img/Treatise");
    // add all the images to the array
    images = images.map((image) => {
        return `/images/Treatise/${image}`;
    });
    console.log(images);
    
    // shuffle the array
    images = _.shuffle(images);
    return images;
}

// function to fill choices with the images
function makeNewChoices() {
    let images = getImages();
    let choices = [];
    let pages = _.sampleSize(images, 4)
    choices.push(...pages);
    
    return choices;
}

function updateChoices() {
  let newChoices = makeNewChoices();
  choices = {
    0: {image: newChoices[0], votes: 0},
    1: {image: newChoices[1], votes: 0},
    2: {image: newChoices[2], votes: 0},
    3: {image: newChoices[3], votes: 0},
  }
}



httpServer.listen(config.PORT, () => {
  console.log(`listening on port ${config.PORT}`);
});