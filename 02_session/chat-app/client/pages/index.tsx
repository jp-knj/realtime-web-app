import Head from "next/head";
import Image from "next/image";
import { useSocket } from "../context/SocketContext";

export default function Home() {
  const { socket } = useSocket();
  return (
    <div>
      <div>
        <div>
          {socket.id}
          <input placeholder="なまえをいれてね" />
          <button className="cta">START</button>
        </div>
      </div>
      <div></div>
    </div>
  );
}
