import socketClient from "socket.io-client";
import store from "../store";
import * as dashboardActions from "../store/actions/dashboardAction";
const SERVER = "http://localhost:5000";

let socket: any;

const broadcastEventTypes = {
  ACTIVE_USERS: "ACTIVE_USERS",
  GROUP_CALL_ROOMS: "GROUP_CALL_ROOMS",
};

export const connectWithWebSocket = () => {
  socket = socketClient(SERVER);
  socket.on("connection", () => {
    console.log("succesfully connected with wss server");
    console.log(socket.id);
  });
  socket.on("broadcast", (data: any) => {
    handleBroadcastEvents(data);
  });
};

export const registerNewUser = (username: string) => {
  socket.emit("register-new-user", {
    username: username,
    socketId: socket.id,
  });
};

const handleBroadcastEvents = (data: any) => {
  switch (data.event) {
    case broadcastEventTypes.ACTIVE_USERS:
      const activeUsers = data.activeUsers.filter(
        (activeUser: any) => activeUser.socketId !== socket.id
      );
      store.dispatch(dashboardActions.setActiveUsers(activeUsers));
      break;
    default:
      break;
  }
};
