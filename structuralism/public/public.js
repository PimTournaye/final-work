import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";

const socket = io("https://localhost:2000");


// Socket stuff
socket.on("connect", () => {
    console.log("Connected to server");
    }
);

socket.on("update", (choices) => {
    console.log("update", choices)
});


function vote(index) {
    socket.emit("vote", index);
}