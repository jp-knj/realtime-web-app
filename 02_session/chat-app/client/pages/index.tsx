import Head from "next/head";
import Image from "next/image";
import { useSockets } from "../context/SocketContext";

export default function Home() {
  return (
    <div>
      <div>
        <div>
          <input placeholder="なまえをいれてね" />
          <button className="cta">START</button>
        </div>
      </div>
      <div></div>
    </div>
  );
}
