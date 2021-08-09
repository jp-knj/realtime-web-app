import React, { useEffect, useRef, useState } from "react";

const Home: React.FC = () => {
  const constraints = {
    audio: true,
    video: true,
  };

  const [camera, setCamera] = useState(true);
  const [mic, setMic] = useState(true);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const localPeerConnectionRef = useRef<RTCPeerConnection>();
  const remotePeerConnectionRef = useRef<RTCPeerConnection>();
  const localStreamRef = useRef<MediaStream>();
  const remoteStreamRef = useRef<MediaStream>();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: mic ? true : false, video: true })
      .then((stream) => {
        localVideoRef.current!.srcObject = camera ? null : stream;
      });
  }, [camera, mic]);

  const onClickStart = async () => {
    console.log("start");
    localStreamRef.current = await navigator.mediaDevices.getUserMedia({
      video: true,
    });
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = localStreamRef.current;
    }
  };

  const onClickCall = () => {
    // On the local side:
    console.log("UI Event: onClickCall btn clicked");
    if (!localStreamRef.current) return;

    console.log("UI Event: onClickCall btn clicked");
    localPeerConnectionRef.current = new RTCPeerConnection();
    localPeerConnectionRef.current.addEventListener(
      "icecandidate",
      (e: RTCPeerConnectionIceEvent) => {
        if (e.candidate) {
          if (!remotePeerConnectionRef.current) return;
          remotePeerConnectionRef.current
            .addIceCandidate(e.candidate)
            .then(() => {
              console.log("RemotePeer Event: addIceCandidate success.");
            })
            .catch((err: Error) => {
              console.log(`Error:${err}`);
            });
        }
      }
    );
  };
  return (
    <>
      <h1>ビデオチャット</h1>
      <button
        onClick={() => {
          setCamera(!camera);
        }}
      >
        カメラ
      </button>
      <button
        onClick={() => {
          setMic(!mic);
        }}
      >
        マイク
      </button>
      <br />
      <video
        ref={localVideoRef}
        style={{ border: "1px solid black" }}
        autoPlay
        playsInline
      />
      <video
        ref={remoteVideoRef}
        style={{ border: "1px solid black" }}
        autoPlay
        playsInline
      />
      <br />

      <button onClick={onClickStart}>start</button>
      <button onClick={onClickCall}>Call</button>
    </>
  );
};

export default Home;
