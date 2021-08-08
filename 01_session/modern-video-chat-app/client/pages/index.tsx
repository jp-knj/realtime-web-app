import React, { useEffect, useRef, useState } from "react";

import ToggleCamera from "../components/ToggleCamera";
import ToggleMic from "../components/ToggleMic";
import Signaling from "../components/Signaling";

const Home: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [camera, setCamera] = useState<boolean>(false);
  const cameraSetter = () => setCamera(!camera);
  const [mute, setMute] = useState<boolean>(false);
  const micSetter = () => setMute(!mute);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({
        audio: false,
        video: {
          width: 600,
          height: 400,
        },
      })
      .then((stream) => {
        videoRef.current!.srcObject = stream;
      });
  }, []);

  //カメラのon/offボタンの実装
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        videoRef.current!.srcObject = camera ? null : stream;
      });
  }, [camera]);

  //マイクのon/offボタンの実装
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: mute ? false : true, video: true })
      .then(() => {});
    console.log(Audio);
  }, [mute]);
  return (
    <>
      <h1>ビデオチャット</h1>
      <ToggleCamera mute={camera} setter={cameraSetter} />
      <ToggleMic mute={mute} setter={micSetter} />
      <br />
      <video
        ref={videoRef}
        id="local-video"
        autoPlay
        playsInline
        muted
        width="320"
        height="240"
      ></video>
      <Signaling />
    </>
  );
};

export default Home;
