import { useEffect, useRef } from "react";
import EVENTS from "../config/events";
import { useSockets } from "../context/socket.context";

const Messages = () => {
  const { socket, messages, roomId, username, setMessages } = useSockets();
  const newMessageRef = useRef(null);
  const messageEndRef = useRef(null);

  function handleSendMessage() {
    const message = newMessageRef.current.value;

    if (!String(message).trim()) {
      return;
    }

    socket.emit(EVENTS.CLIENT.SEND_ROOM_MESSAGE, { roomId, message, username });

    const date = new Date();

    setMessages([
      ...messages,
      {
        username: "You",
        message,
        time: `${date.getHours()}:${date.getMinutes()}`,
      },
    ]);

    newMessageRef.current.value = "";
  }

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!roomId) {
    return <div />;
  }
  return (
    <div>
      <div>
        {messages.map(({ message, username, time }, index) => {
          return (
            <div key={index}>
              <div key={index}>
                <span>
                  {username} - {time}
                </span>
                <span>{message}</span>
              </div>
            </div>
          );
        })}
        <div ref={messageEndRef} />
      </div>
      <div>
        <textarea
          rows={1}
          placeholder="Tell us what you are thinking"
          ref={newMessageRef}
        />
        <button onClick={handleSendMessage}>send</button>
      </div>
    </div>
  );
};

export default Messages;
