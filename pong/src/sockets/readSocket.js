import express from 'express';
const app = express();
import { createServer } from 'http';
const server = createServer(app);
import { Server } from "socket.io";
const io = new Server(server);
import { networkInterfaces as _networkInterfaces } from 'os';

var networkInterfaces = _networkInterfaces();


io.on('connection', (socket) => {

  console.log('Connected');
  console.log(socket.id);
  console.log("JWT token test: ", socket.handshake.headers)

  socket.on('arduino_event', (data) => {

    console.log("Message from Client: ", data);

    // socket.broadcast.emit("Send Message socket.broadcast.emit : ", data);
    // io.emit("Send Message io.emit Broadcasted : ", data);
    // socket.emit("Send Message : ", data);

  })
  
  socket.on('disconnect', () => {

    console.log('Disconnected');

  })

})

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(8080, () => {
  console.log("Server launched on port 8080");
})