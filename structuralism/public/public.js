import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io("https://localhost:2000");

let gameOver = false;
let hasVoted = false;

let currentChoices;
let currectRound;

let globalTime;
let roundToIntroduceGameOver;
let showScoresTimemark;
let maxTimer;

// Socket stuff
socket.on("connection", (data) => {
  console.log("Connected to server");
  currectRound = data.round;
  roundToIntroduceGameOver = data.roundToIntroduceGameOver;
  showScoresTimemark = data.showScoresTimemark;
});

socket.on("update", (time) => {
  globalTime = time;
});

socket.on("refresh done", (choices) => {
  console.log("refresh done", choices)

});

socket.on("new round", (choices) => {
  console.log("new round", choices)
  currentChoices = choices
  hasVoted = false;
});

// FUNCTIONS
const generateHTML = (choices, index) => {
  let html = `
    <div class="scoreContainer" id="score-${index}"><figure>
            <img src="${choices.image}">
            <button class="btn btn-block btn-xs sm:btn-sm md:btn-md lg:btn-lg" onclick="vote(${index})"></button>
        </figure></div>`;
  return html;
}

const gameOverButton = `<button class="btn btn-block btn-lg sm:btn-sm md:btn-md lg:btn-lg" onclick="vote(4)">Vote to end the piece?</button>`

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

function startTimer() {
  if (gameOver) {
    // if the progress element is still present, remove it
    if (document.getElementById("progress")) {
      document.getElementById("progress").remove();
    }
    document.querySelector("#scores").innerHTML = "<h1>Game Over</h1>";
    return;
  } else {
    let element = document.getElementById("timer");
    let timer = setInterval(() => {
      time--;
      // replace the element with a new one
      element.innerHTML = `<progress class="progress w-56" value="${timer}" max="${time}"></progress>`;
      if (time === showScoresTimemark) {
        showScores();
      }
      if (time <= 0) {
        clearInterval(timer);
        socket.emit("refresh");
        document.querySelector("#scores").innerHTML = "<h1>Please wait...</h1>";
      }
    }, 1000);
  }
}


