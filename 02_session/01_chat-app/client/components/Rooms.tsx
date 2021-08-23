import { useRef } from "react";
import { useSockets } from "../context/socket.context";
import EVENTS from "../config/events";
const Rooms = () => {
  const { socket, roomId, rooms } = useSockets();
  const newRoomRef = useRef(null);

  function handleCreateRoom() {
    //get the room name
    const roomName = newRoomRef.current.value || "";

    if (!String(roomName).trim()) return;

    // emit room created event
    socket.emit(EVENTS.CLIENT.CREATE_ROOM, { roomName });

    // set room name input to empty string
    newRoomRef.current.value = "";
  }

  function handleJoinRoom(key: string) {
    if (key === roomId) return;

    socket.emit(EVENTS.CLIENT.JOIN_ROOM, key);
  }
  return (
    <nav>
      <div>
        <input ref={newRoomRef} placeholder="Room name" />
        <button className="cta" onClick={handleCreateRoom}>
          Create ROOM
        </button>
      </div>

      <ul>
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
      </ul>
    </nav>
  );
};

export default Rooms;
