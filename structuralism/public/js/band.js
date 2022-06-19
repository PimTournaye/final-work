import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const SOCKET_SERVER_URL = "http://localhost";
const SOCKET_SERVER_PORT = 2000;

const socket = io(`${SOCKET_SERVER_URL}:${SOCKET_SERVER_PORT}`);

let globalTime, maxTimer;

async function start() {
    let url = `${SOCKET_SERVER_URL}:${SOCKET_SERVER_PORT}/start`;
    socket.emit("start");

    // POST /start to start the game
    let response = await postData(url);
    // remove the start button
    document.querySelector("#btn").remove();
}
document.querySelector("#btn").addEventListener("click", () => {
    start();
});

window.onload = async () => {
    let initial = await fetch(`${SOCKET_SERVER_URL}:${SOCKET_SERVER_PORT}/initial`);
    let initialScore = await initial.json();
    document.querySelector("#score").innerHTML = `<img src="${initialScore.image}">`;
}


socket.on("connection", (data) => {
    console.log("Connected to server");
});

socket.on("update", (data) => {
    console.log("update received");
    maxTimer = data.maxTimer;
    globalTime = data.timer;

    // Replace the progress element values with given data
    let progress = document.querySelector("#timer");
    progress.max = maxTimer;
    // Displaying counting up insread of down to go along with the score
    progress.value = maxTimer - globalTime;
});

socket.on("start", () => {
    console.log("start received");
    // if the start button is stil there, remove it
    if (document.querySelector("#btn")) {
        document.querySelector("#btn").remove();
    }
});

socket.on("new-round-band", (score) => {
    console.log('Got new round');
    // update the score dom element with the new score
    document.querySelector("#score").innerHTML = `<img src="${score}" class="md:container md:mx-auto">`;
});

socket.on("game-over", () => {
    console.log("Game over");
    // show the game over screen
    document.querySelector("#score").innerHTML = `<h1 class="md:container md:mx-auto">Game over!</h1>`;
    // re-add the start button back to the dom
    document.querySelector("#btn").innerHTML = `<button class="md:container md:mx-auto md:w-full md:h-12 md:bg-blue-500 md:text-white md:font-bold md:text-center">Start</button>`;
});

// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response;
}