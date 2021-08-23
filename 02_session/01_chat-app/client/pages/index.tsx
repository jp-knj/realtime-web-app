import { useEffect, useRef } from "react";
import Messages from "../components/Messages";
import Rooms from "../components/Rooms";
import { useSockets } from "../context/socket.context";

export default function Home() {
  const { socket, username, setUsername } = useSockets();
  const usernameRef = useRef(null);

  function handleSetUsername() {
    const value = usernameRef.current.value;
    if (!value) {
      return;
    }

    setUsername(value);

    localStorage.setItem("username", value);
  }

  useEffect(() => {
    if (usernameRef)
      usernameRef.current.value = localStorage.getItem("username") || "";
  }, []);

  return (
    <>
      {!username && (
        <div>
          <input placeholder="Username" ref={usernameRef} />
          <button onClick={handleSetUsername}>Start</button>
        </div>
      )}
      {username && (
        <>
          <Rooms />
          <Messages />
        </>
      )}
    </>
  );
}
