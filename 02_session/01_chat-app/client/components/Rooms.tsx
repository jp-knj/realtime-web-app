import { useRef } from "react";
import { useSockets } from "../context/socket.context";
import EVENTS from "../config/events";
const Rooms = () => {
  const { socket, roomId, rooms } = useSockets();
  const newRoomRef = useRef(null);

  function handleCreateRoom() {
    // get room name
    const roomName = newRoomRef.current.value || "";
    if (!String(roomName).trim()) return;

    // emit room create event
    socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomName });

    // set room name input to empty string
    newRoomRef.current.value = "";
  }
  return (
    <nav>
      <>
        <input ref={newRoomRef} placeholder="Room name" />
        <button onClick={handleCreateRoom}>Create Room</button>
      </>
      {Object.keys(rooms).map((key) => {
        return <div key={key}>{rooms[key].name}</div>;
      })}
    </nav>
  );
};

export default Rooms;
