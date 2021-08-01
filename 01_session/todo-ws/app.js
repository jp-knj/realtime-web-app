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
  () => {
    // Next.jsのリクエストハンドラを引数にhttp.createServer()を実行
    const server = http.createServer(nextApp.getRequestHandler()).listen(3000);

    // WebSocket.Serverインスタンスを生成
    const ws = new WebSocket.Server({ server });

    // 接続中の全クライアントに現在のToDo一覧を送信する関数
    function sendTodosToOpenClient() {
      ws.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(todos));
        }
      });
    }
  },
  (err) => {
    console.error(err);
  }
);
