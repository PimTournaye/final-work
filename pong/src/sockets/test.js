import { createServer } from "http";
import { Server } from "socket.io";

const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
});

io.on("connection", (socket) => {
    console.log('a user connected');

    socket.on('arduino_event', (data) => {
        console.log("Message from Client : ", data);
        socket.broadcast.emit("Send Message socket.broadcast.emit : ", data);
     io.emit("Send Message io.emit Broadcasted : ", data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });
});

httpServer.listen(8080);