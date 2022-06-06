import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io("https://localhost:2000");

socket.on("connection", (data) => {
    console.log("Connected to server");
});

socket.on("initial score", (score) => {
    // fill the img dom element with the initial score
    document.querySelector("#score").innerHTML = `<img src="${score}">`;
});

socket.on("new round"), (score) => {
    // update the score dom element with the new score
    document.querySelector("#score").innerHTML = `<img src="${score}">`;
};

socket.on("game over"), () => {
    // show the game over screen
    document.querySelector("#score").innerHTML = `<h1>Game over!</h1>`;
}