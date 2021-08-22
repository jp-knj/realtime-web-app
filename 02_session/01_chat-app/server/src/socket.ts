import { Server, Socket } from "socket.io";
import logger from "./utils/logger";

const EVENTS = {
  connection: "connection",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
  },
};

function socket({ io }: { io: Server }) {
  logger.info("Socket enabled");
  io.on(EVENTS.connection, (socket: Socket) => {
    logger.info(`user loggin ${socket.id}`);
  });
}

export default socket;
