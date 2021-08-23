import { useRef } from "react";
import { useSockets } from "../context/socket.context";
import EVENTS from "../config/events";
const Rooms = () => {
  const { socket, roomId, rooms } = useSockets();
  const newRoomRef = useRef(null);

  function handleCreateRoom() {
    const roomName = newRoomRef.current.value || "";
    if (!String(roomName).trim()) return;
    socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomName });
    newRoomRef.current.value = "";
  }
  function handleJoinRoom(key: string) {
    if (key === roomId) return;
    socket.emit(EVENTS.CLIENT.JOIN_ROOM, key);
  }
  return (
    <nav>
      <>
        <input ref={newRoomRef} placeholder="Room name" />
        <button onClick={handleCreateRoom}>Create Room</button>
      </>
      {Object.keys(rooms).map((key) => {
        return (
          <div key={key}>
            <button
              disabled={key === roomId}
              title={`Join ${rooms[key].name}`}
              onClick={() => handleJoinRoom(key)}
            >
              {rooms[key].name}
            </button>
          </div>
        );
      })}
    </nav>
  );
};

export default Rooms;
