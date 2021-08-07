import React, { FC, useEffect, useRef, useState } from "react";

/**
 * non server video stream connection.
 */
const Session2: FC = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localStreamRef = useRef<MediaStream>();
  const remoteStreamRef = useRef<MediaStream>();
  const localPeerConnectionRef = useRef<RTCPeerConnection>();
  const remotePeerConnectionRef = useRef<RTCPeerConnection>();

  return (
    <div>
      <h2>Sample 2</h2>
      <p>non server video stream connection.</p>
      <video
        ref={localVideoRef}
        style={{ width: "320px", maxWidth: "100%" }}
        autoPlay
        playsInline
      />
      <video
        ref={remoteVideoRef}
        style={{ width: "320px", maxWidth: "100%" }}
        autoPlay
        playsInline
      />
      <div>
        <button onClick={onClickStart} disabled={isStarted}>
          Start
        </button>
        <button onClick={onClickCall} disabled={!isStarted || isCalling}>
          Call
        </button>
        <button onClick={onClickHangUp} disabled={!isCalling}>
          Hang Up
        </button>
      </div>
    </div>
  );
};

export default Session2;
