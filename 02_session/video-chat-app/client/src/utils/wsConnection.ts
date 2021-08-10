import express from "express";
import socketClient from "socket.io-client";

const SERVER = "http://localhost:5000";

export const connectWithWebSocket = () => {
  const socket = socketClient(SERVER);

  socket.on("connection", () => {
    console.log("succesfully connected with wss server");
    console.log(socket.id);
  });
};
