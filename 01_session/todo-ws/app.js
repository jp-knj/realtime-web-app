"use strict";
const http = require("http");
const next = require("next");
const WebSocket = require("ws");

let todos = [
  { id: 1, title: "ネーム", completed: false },
  { id: 2, title: "下書き", completed: true },
];

// IDの値を管理するための変数
let id = 2;

const dev = process.env.NODE_ENV !== "production";
const nextApp = next({ dev });

nextApp.prepare().then(
  () => {},
  (err) => {
    console.error(err);
  }
);
