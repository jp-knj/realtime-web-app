import React, { useState } from "react";

const Session1: React.FC = () => {
  const constraints = {
    audio: true,
    video: true,
  };
  const localVideoRef = React.useRef<HTMLVideoElement>(null);
  const [camera, setCamera] = useState(false);

  let status;
  if (camera) {
    status = "off";
  } else {
    status = "on";
  }

  React.useEffect(() => {
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      localVideoRef.current!.srcObject = stream;
    });
  }, []);

  React.useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: true, video: true })
      .then((stream) => {
        localVideoRef.current!.srcObject = camera ? null : stream;
      });
  }, [camera]);
  return (
    <>
      <p>getUserMedia():</p>
      <button onClick={() => setCamera(!camera)}>camera:{status}</button>
      <video
        ref={localVideoRef}
        width={600}
        height={400}
        autoPlay
        playsInline
      ></video>
    </>
  );
};

export default Session1;
