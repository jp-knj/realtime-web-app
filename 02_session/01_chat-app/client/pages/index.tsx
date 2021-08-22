import Messages from "../components/Messages";
import Rooms from "../components/Rooms";
import { useSockets } from "../context/socket.context";

export default function Home() {
  const { socket } = useSockets();
  return (
    <>
      <Rooms />
      <Messages />
      <h2>{socket.id}</h2>
    </>
  );
}
