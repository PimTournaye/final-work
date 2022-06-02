const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
var os = require('os');

var networkInterfaces = os.networkInterfaces();

console.log(networkInterfaces);

io.on('connection', (socket) => {

  console.log('Connected');
  console.log(socket.id);
  console.log("JWT token test: ", socket.handshake.headers)

  socket.on('arduino_event', (data) => {

    console.log("Message from Client : ", data);

    socket.broadcast.emit("Send Message socket.broadcast.emit : ", data);
    io.emit("Send Message io.emit Broadcasted : ", data);
    socket.emit("Send Message : ", data);

  })
  
  socket.on('disconnect', () => {

    console.log('Disconnected');

  })

})

server.listen(8080, () => {
  console.log("Server launched on port 8080");
})