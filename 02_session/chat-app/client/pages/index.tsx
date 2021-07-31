import { useEffect, useRef } from "react";
import Head from "next/head";
import Image from "next/image";
import { useSocket } from "../context/SocketContext";

import Messages from "../components/Messages";
import Rooms from "../components/Rooms";

export default function Home() {
  const { socket, username, setUsername } = useSocket();
  const usernameRef = useRef(null);
  function handleSetUsername() {
    const value = usernameRef.current.value;
    if (!value) {
      return;
    }

    setUsername(value);

    localStorage.setItem("username", value);
  }
  return (
    <div>
      {!username && (
        <div>
          <div>
            <input placeholder="なまえをいれてね" ref={usernameRef} />
            <button onClick={handleSetUsername}>START</button>
          </div>
        </div>
      )}
      {username && (
        <>
          <Messages />
          <Rooms />
        </>
      )}
    </div>
  );
}
