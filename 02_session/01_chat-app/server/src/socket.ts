import { nanoid } from "nanoid";
import { Server, Socket } from "socket.io";
import logger from "./utils/logger";

const EVENTS = {
  connection: "connection",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
  },
  SERVER: {
    ROOMS: "ROOMS",
    JOIN_ROOM: "JOIN_ROOM",
  },
};

// room Obj
const rooms: Record<string, { name: string }> = {};

function socket({ io }: { io: Server }) {
  logger.info("Socket enabled");
  io.on(EVENTS.connection, (socket: Socket) => {
    logger.info(`user loggin ${socket.id}`);

    socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
      console.log({ roomName });

      // Create roomId
      const roomId = nanoid();

      // add a new room to the room obj
      rooms[roomId] = {
        name: roomName,
      };
      // join(roomId)
      socket.join(roomId);

      // broadcast an event
      socket.broadcast.emit(EVENTS.SERVER.ROOMS);

      // emit back to the room creator with all the rooms
      socket.emit(EVENTS.SERVER.ROOMS, rooms);
      socket.emit(EVENTS.SERVER.JOIN_ROOM, roomId);

      // emit event back the room creator
    });
  });
}

export default socket;
