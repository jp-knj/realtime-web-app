import { useRef } from "react";
import Messages from "../components/Messages";
import Rooms from "../components/Rooms";
import { useSockets } from "../context/socket.context";

export default function Home() {
  const { socket, username, setUsername } = useSockets();
  const usernameRef = useRef(null);

  function handleSetUsername() {
    const value = usernameRef.current.value;
    if (!value) return;
    setUsername(value);
    localStorage.setItem("username", value);
  }
  return (
    <>
      {!username && (
        <div>
          <input placeholder="Username" ref={usernameRef} />
          <button onClick={handleSetUsername}>Start</button>
        </div>
      )}
      <Rooms />
      <Messages />
      <h2>{socket.id}</h2>
    </>
  );
}
