import React, { useRef, useState } from "react";

const Session3: React.FC = () => {
  const textareaSendRef = useRef<HTMLTextAreaElement>(null);
  const textareaReceiveRef = useRef<HTMLTextAreaElement>(null);
  const sendChannelRef = useRef<RTCDataChannel>();
  const receiveChannelRef = useRef<RTCDataChannel>();
  const localPeerConnectionRef = useRef<RTCPeerConnection>();
  const remotePeerConnectionRef = useRef<RTCPeerConnection>();
  const [isStarted, setIsStarted] = useState(false);
  const onClickStart = () => {};
  const onClickSend = () => {};
  const onClickStop = () => {};

  return (
    <>
      <h2>Session3</h2>
      <textarea
        ref={textareaSendRef}
        placeholder="Press Start, enter some text, then press Send."
      />
      <textarea ref={textareaReceiveRef} />
      <div>
        <button onClick={onClickStart}>Start</button>
        <button onClick={onClickSend}>Send</button>
        <button onClick={onClickStop}>Stop</button>
      </div>
    </>
  );
};

export default Session3;
