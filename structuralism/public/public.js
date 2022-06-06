import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io("https://localhost:2000");

let gameOver = false;
let currentChoices;
let hasVoted = false;

// Socket stuff
socket.on("connection", () => {
    console.log("Connected to server");
});

socket.on("update", (choices) => {
    currentChoices = choices
});

socket.on("refresh done", (choices) => {
    console.log("refresh done", choices)
    
});

// FUNCTIONS

function showScores(choices) {
    
}

// Send your vote to the server
function vote(index) {
    if (hasVoted) {
        return;
    }
    socket.emit("vote", index);
    hasVoted = true;
}

// make a timer that counts down from 60 seconds, with a progress bar, when it hits 0, it should send a message to the server to refresh the choices
// when the server sends a new set of choices, the timer should reset and the progress bar should reset
// when the user clicks on a choice, it should send a vote to the server, and lock out the choice until the server responds
function startTimer() {
    if (gameOver) {
        // if the progress element is still present, remove it
        if (document.getElementById("progress")) {
            document.getElementById("progress").remove();
        }
        return;
    }
    let time = 60;
    let showScoresTimemark = 40;
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
        }
    }, 1000);
}


