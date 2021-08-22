import { createContext, useContext, useState } from "react";
import io, { Socket } from "socket.io-client";
import { SOCKET_URL } from "../config/default";

interface Context {
  socket: Socket;
  username?: string;
  setUsername: Function;
}

const socket = io(SOCKET_URL);
const SocketContext = createContext<Context>({
  socket,
  setUsername: () => false,
});

const SocketsProvider = (props: any) => {
  const [username, setUsername] = useState<string>("");
  return (
    <SocketContext.Provider
      value={{ socket, username, setUsername }}
      {...props}
    />
  );
};

export const useSockets = () => useContext(SocketContext);

export default SocketsProvider;
