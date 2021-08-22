import { useRef } from "react";
import EVENTS from "../config/events";
import { useSockets } from "../context/socket.context";

const Messages = () => {
  const { socket, messages, roomId, username, setMessages } = useSockets();
  const newMessageRef = useRef(null);
  function handleSendMessage() {
    const message = newMessageRef.current.value;
    if (!String(message).trim()) {
      return;
    }
    socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, { roomId, message, username });
    const date = new Date();
    setMessages([
      ...message,
      {
        username: "You",
        message,
        time: `${date.getHours()}: ${date.getMinutes()}}`,
      },
    ]);
  }

  if (!roomId) {
    return <div />;
  }

  return (
    <>
      {messages.map(({ messages }, index) => {
        return <p key={index}> {messages}</p>;
      })}
      <>
        <textarea
          rows={1}
          placeholder="Tell us what you are thing"
          ref={newMessageRef}
        />
        <button onClick={handleSendMessage}>Send</button>
      </>
    </>
  );
};

export default Messages;
