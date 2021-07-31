import { useRef } from "react";
import EVENTS from "../config/events";
import { useSocket } from "../context/SocketContext";

const Rooms = () => {
  const { socket, roomId, rooms } = useSocket();
  const newRoomRef = useRef(null);

  function handleCreateRoom() {
    // 部屋名を取得
    const roomName = newRoomRef.current.value || "";
    if (!String(roomName).trim()) return;

    // 部屋を作成するイベントを発火
    socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomName });
    // Input の value を空文字に戻す
    newRoomRef.current.value = "";
  }
  return (
    <nav>
      <div>
        <input ref={newRoomRef} placeholder="へやのなまえをいれてね" />
        <button onClick={handleCreateRoom}>へやをつくる</button>
      </div>
      <ul>
        {Object.keys(rooms).map((key) => {
          return <div key={key}>{rooms[key].name}</div>;
        })}
      </ul>
    </nav>
  );
};
export default Rooms;
