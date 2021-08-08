import React, { useEffect, useRef, useState } from "react";

const Session2: React.FC = () => {
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
      <h2>Session 2</h2>
      <p>stream connection</p>
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
        <button>Start</button>
        <button>Call</button>
        <button>Hang Up</button>
      </div>
    </div>
  );
};

export default Session2;
