import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io("https://localhost:2000");

socket.on("connection", (data) => {
    console.log("Connected to server");
});

socket.on("initial score", (score) => {
    // fill the score dom element with the initial score
    document.querySelector("#score").innerHTML = score;
});