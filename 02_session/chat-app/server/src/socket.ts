import { nanoid } from "nanoid";
import { Server, Socket } from "socket.io";
import logger from "./utils/logger";

const EVENTS = {
  connection: "connection",
  CLIENT: {
    CREATE_ROOM: "CREATE_ROOM",
    SEND_ROOM_MESSAGE: "SEND_ROOM_MESSAGE",
    JOIN_ROOM: "JOIN_ROOM",
  },
  SERVER: {
    ROOMS: "ROOMS",
    JOINED_ROOM: "JOINED_ROOM",
    ROOM_MESSAGE: "ROOM_MESSAGE",
  },
};

const rooms: Record<string, { name: string }> = {};

function socket({ io }: { io: Server }) {
  logger.info(`Sockets enabled`);

  io.on(EVENTS.connection, (socket: Socket) => {
    logger.info(`User connected ${socket.id}`);

    // socket.emit(EVENTS.SERVER.ROOMS, rooms);

    /*
     * When a user creates a new room
     */
    socket.on(EVENTS.CLIENT.CREATE_ROOM, ({ roomName }) => {
      console.log({ roomName });
      // create a room id
      const roomId = nanoid();

      // add a new room to the rooms object
      rooms[roomId] = {
        name: roomName,
      };
      socket.join(roomId);
      //
      socket.broadcast.emit(EVENTS.SERVER.ROOMS, rooms);

      //
      socket.emit(EVENTS.SERVER.ROOMS, rooms);

      socket.emit(EVENTS.SERVER.JOINED_ROOM, roomId);
    });

    /*
     * When a user sends a room message
     */

    /*
     * When a user joins a room
     */
  });
}

export default socket;