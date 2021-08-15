import { Server, Socket } from "socket.io";
import logger from "./utils/logger";

const broadcastEventTypes = {
  ACTIVE_USERS: "ACTIVE_USERS",
  GROUP_CALL_ROOMS: "GROUP_CALL_ROOMS",
};
function socket({ io }: { io: Server }) {
  let peers: any = [];
  logger.info(`Sockets enabled`);
  io.on("connection", (socket: Socket) => {
    socket.emit(`connection`, null);
    logger.info(`User connected`);

    /*
     * When a user login
     */
    socket.on("register-new-user", (data: any) => {
      peers.push({
        username: data.username,
        socket: data.socketId,
      });
      console.log("register new user");
      console.log(peers);
      io.sockets.emit("broadcast", {
        event: broadcastEventTypes.ACTIVE_USERS,
        activeUsers: peers,
      });
    });
  });
}
export default socket;
