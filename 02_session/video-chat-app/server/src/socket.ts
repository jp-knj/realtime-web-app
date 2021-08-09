import { Server, Socket } from "socket.io";
import logger from "./utils/logger";

function socket({ io }: { io: Server }) {
  logger.info(`Sockets enabled`);
  io.on("connection", (socket: Socket) => {
    socket.emit(`connection`, null);
    logger.info(`User connected`);
  });
}
export default socket;
