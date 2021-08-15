const express = require("express");
const socket = require("socket.io");

const PORT = 5000;

const app = express();

const server = app.listen(PORT, () => {
  console.log(`server is listening on port ${PORT}`);
});

const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

let peers = [];

io.on("connection", (socket) => {
  socket.emit(`connection`, null);
  console.log("new user connected");
  console.log(socket.id);

  socket.on("register-new-user", (data) => {
    peers.push({
      username: data.username,
      socket: data.socketId,
    });
    console.log("register new user");
    console.log(peers);
  });
});
