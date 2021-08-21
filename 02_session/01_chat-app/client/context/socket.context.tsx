import { createContext, useContext } from "react";
import io, { Socket } from "socket.io-client";
import { SOCKET_URL } from "../config/default";

interface Context {
  socket: Socket;
}

const socket = io(SOCKET_URL);
const SocketContext = createContext<Context>({ socket });

const SocketsProvider = (props: any) => {
  return <SocketContext.Provider value={{ socket }} {...props} />;
};

export const useSockets = () => useContext(SocketContext);

export default SocketsProvider;
