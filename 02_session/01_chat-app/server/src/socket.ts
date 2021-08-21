import { Server, Socket } from "socket.io";
import logger from "./utils/logger";

function socket({ io }: { io: Server }) {
  logger.info("Socket enabled");
  io.on("connection", (socket: Socket) => {
    logger.info(`user loggin ${socket.id}`);
  });
}

export default socket;
