import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
    // options
});

io.on("connection", (socket) => {
    console.log('a user connected');

    socket.on('arduino_event', (data) => {
        console.log("Message from Client : ", data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

httpServer.listen(8080);