import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io();

let gameOver = false;
let hasVoted = false;

let currentChoices;
let currectRound;

let globalTime;
let roundToIntroduceGameOver;
let showScoreChoiceTime;
let maxTimer;

// Socket stuff
socket.on("connect", () => {
  console.log("Connected to server");
});

socket.on("setup", (data) => {
  console.log("Setting up game");
  updateGameData(data);
});

socket.on("update", (data) => {
  console.log('got update data');

  // update the game data for everything to properly work
  updateGameData(data);

  // replace the progress element value with a globalTime
  let progress = document.querySelector("#timer");
  progress.value = globalTime;
  progress.max = maxTimer;
  // if we have met showScoreChoiceTime, show the scores
  if (globalTime == showScoreChoiceTime) {
    showScores(currentChoices);
  }
  if (globalTime <= 0) {
    document.querySelector("#scores").innerHTML = `<h1 class="md:container md:mx-auto">Please wait...</h1>`;
  }
});

socket.on("new-round-public", (data) => {
  console.log("new round from server");

  // reset voting status
  hasVoted = false;

  // reset the opacity of the containers for when they pop up later
  let containers = document.querySelectorAll(".scoreContainer");
  for (let i = 0; i < containers.length; i++) {
    containers[i].style.opacity = "1";
  }

  // clear the scores div
  document.querySelector("#scores").innerHTML = `<h1 class="md:container md:mx-auto">Please wait...</h1>`;
});

socket.on("game-over", () => {
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
    <div class="scoreContainer md:container md:mx-auto px-4 mb-10" id="score-${index}"><figure>
            <img src="${choices.image}">
            <button class="btn btn-block btn-xs sm:btn-sm md:btn-md lg:btn-lg btn-primary" id="btn-${index} data=${index}">VOTE</button>
        </figure></div>`;
    return html;
  }
}
const gameOverButton = `
<div class="ScoreContainer md:container md:mx-auto px-4">
<button class="btn btn-block btn-lg sm:btn-sm md:btn-md lg:btn-lg" id="btn-gameOver">Vote to end the piece?</button>
</div>`;

// Reveal the score options and allow voting
function showScores(choices) {
  // clear the scores div
  document.querySelector("#scores").innerHTML = "";
  // generate html for the scores and append it to the scores div 
  for (let i = 0; i < choices.length; i++) {
    let html = generateHTML(choices[i], i);
    document.querySelector("#scores").innerHTML += html;
  }

  // add event listeners to the buttons to call the vote function
  let buttons = document.querySelectorAll("#scores button");
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener("click", () => {
      vote(i);
    });
  }
  // if we have met roundToIntroduceGameOver, add in the game over button
  if (currectRound >= roundToIntroduceGameOver) {
    element += gameOverButton;
  }
}

function updateGameData(data) {
  currentChoices = data.choices;
  globalTime = data.timer;
  currectRound = data.round;
  showScoreChoiceTime = data.showScoreChoiceTime;
  roundToIntroduceGameOver = data.roundToIntroduceGameOver;
  maxTimer = data.maxTimer;
}

// Send your vote to the server
function vote(index) {
  if (hasVoted) {
    return;
  } else {
    console.log(index);
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
}


