import { useRef } from "react";
import { useSockets } from "../context/socket.context";
const Rooms = () => {
  const { socket, roomId, rooms } = useSockets();
  const newRoomRef = useRef(null);

  function handleCreateRoom() {
    // get room name
    // emit room create event
    // set room name input to empty string
  }
  return (
    <nav>
      <>
        <input ref={newRoomRef} placeholder="Room name" />
        <button onClick={handleCreateRoom}>Create Room</button>
      </>
    </nav>
  );
};

export default Rooms;
