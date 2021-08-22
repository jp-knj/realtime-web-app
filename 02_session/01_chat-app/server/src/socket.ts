import { nanoid } from "nanoid";
import { Server, Socket } from "socket.io";
import logger from "./utils/logger";

const EVENTS = {
  connection: "connection",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    JOIN_ROOM: "JOIN_ROOM",
    SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
  },
  SERVER: {
    ROOMS: "ROOMS",
    JOINED_ROOM: "JOINED_ROOM",
    ROOM_MESSAGE: "ROOM_MESSAGE",
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

      // emit event back the room creator
      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });

    socket.on(
      EVENTS.CLIENT.SEND_ROOM_MESSAGE,
      ({ roomId, message, username }) => {
        const date = new Date();

        socket.to(roomId).emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, {
          message,
          username,
          time: `${date.getHours()}:${date.getMinutes()}`,
        });
      }
    );

    socket.on(EVENTS.CLIENT.JOIN_ROOM, (roomId) => {
      socket.join(roomId);
      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });
  });
}

export default socket;
