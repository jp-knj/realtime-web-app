import { createContext, useContext, useState } from "react";
import io, { Socket } from "socket.io-client";
import { SOCKET_URL } from "../config/default";
import EVENTS from "../config/events";

interface Context {
  socket: Socket;
  username?: string;
  setUsername: Function;
  messages?: { messages: string; username: string; time: string }[];
  setMessages: Function;
  roomId?: string;
  rooms: object;
}

const socket = io(SOCKET_URL);
const SocketContext = createContext<Context>({
  socket,
  setUsername: () => false,
  messages: [],
  setMessages: () => false,
  rooms: {},
  messages: [],
});

const SocketsProvider = (props: any) => {
  const [username, setUsername] = useState<string>("");
  const [roomId, setRoomId] = useState("");
  const [rooms, setRooms] = useState({});
  const [messages, setMessages] = useState([]);
  socket.on(EVENTS.SERVER.ROOMS, (value) => {
    setRooms(value);
  });

  socket.on(EVENTS.SERVER.JOINED_ROOM, (value) => {
    setRoomId(value);
    setMessages([]);
  });

  socket.on(EVENTS.SERVER.ROOM_MESSAGE, ({ messages, username, time }) => {
    setMessages([...messages, { messages, username, time }]);
  });

  return (
    <SocketContext.Provider
      value={{
        socket,
        username,
        setUsername,
        roomId,
        rooms,
        messages,
        setMessages,
      }}
      {...props}
    />
  );
};

export const useSockets = () => useContext(SocketContext);

export default SocketsProvider;
