import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import { config } from "./config";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static("public"));

let choices = {
    0: {}
}

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get("band", (req, res) => {
    res.sendFile(__dirname + "/band.html");
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("vote", (index) => {
      io.emit("vote", index);

      // gedoe gedoee

      io.emit('update', choices);
    });

});

httpServer.listen(config.PORT, () => {
    console.log(`listening on port ${config.PORT}`)
});
