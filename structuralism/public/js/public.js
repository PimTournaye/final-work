import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
//const socket = io("https://localhost:2000");
const socket = io();

let gameOver = false;
let hasVoted = false;

let currentChoices;
let currectRound;

let globalTime;
let roundToIntroduceGameOver;
let showScoresTimemark;
let maxTimer;

// Socket stuff
socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("update", (data) => {
  console.log(data);
  currectRound = data.round;
  roundToIntroduceGameOver = data.roundToIntroduceGameOver;
  showScoresTimemark = data.showScoresTimemark;
  maxTimer = data.maxTimer;
  globalTime = data.globalTime;
  currentChoices = data.choices;
});

socket.on("tick", (data) => {
  globalTime = data.time;
  // replace the element with a new one
  let element = document.querySelector("#timer").innerHTML;
  element = `<progress class="progress w-56" value="${time}" max="${maxTimer}"></progress>`;
  if (globalTime >= showScoresTimemark) {
    showScores();
  }
  if (globalTime <= 0) {
    document.querySelector("#scores").innerHTML = "<h1>Please wait...</h1>";
  }
});

socket.on("new round", (choices) => {
  console.log("new round", choices)
  currentChoices = choices
  hasVoted = false;
});

socket.on("game over", () => {
  gameOver = true;
  document.querySelector("#scores").innerHTML = "<h1>Game over!</h1>";
  if (document.getElementById("progress")) {
    document.getElementById("progress").remove();
  }
});

// FUNCTIONS
const generateHTML = (choices, index) => {
  if (choices.image === "Game Over") {
    return gameOverButton;
  } else {
    let html = `
    <div class="scoreContainer" id="score-${index}"><figure>
            <img src="${choices.image}">
            <button class="btn btn-block btn-xs sm:btn-sm md:btn-md lg:btn-lg" onclick="vote(${index})"></button>
        </figure></div>`;
    return html;
  }
}
const gameOverButton = `
<div class=ScoreContainer>
<button class="btn btn-block btn-lg sm:btn-sm md:btn-md lg:btn-lg" onclick="vote(4)">Vote to end the piece?</button>
</div>`;

// Reveal the score options and allow voting
function showScores(choices) {
  let element = document.querySelector("#scores").innerHTML = "";
  for (let i = 0; i < choices.length; i++) {
    element += generateHTML(choices[i], i);
  }
  // if we have met roundToIntroduceGameOver, add in the game over button
  if (currectRound >= roundToIntroduceGameOver) {
    element += gameOverButton;
  }
}

// Send your vote to the server
function vote(index) {
  if (hasVoted) {
    return;
  }
  socket.emit("vote", index);
  hasVoted = true;
  // lower opacity of the other containers
  let containers = document.querySelectorAll(".scoreContainer");
  for (let i = 0; i < containers.length; i++) {
    if (i !== index) {
      containers[i].style.opacity = 0.5;
    }
  }
}


