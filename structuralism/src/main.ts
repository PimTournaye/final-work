import { io, Socket } from "socket.io-client";

let socket: Socket = io();

socket.on('vote', (data: any) => {
    console.log(data);
});