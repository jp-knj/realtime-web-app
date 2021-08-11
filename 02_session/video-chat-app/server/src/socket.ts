import { Server, Socket } from "socket.io";
import logger from "./utils/logger";

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
    });
  });
}
export default socket;
