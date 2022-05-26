import { createServer } from "http";
import { Server } from "socket.io";
const PORT = process.env.PORT || 3000;

const httpServer = createServer();
const io = new Server(httpServer, {
  // options
});

io.on('connection', (socket) => {
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
  });
});
httpServer.listen(PORT);

