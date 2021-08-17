import React from "react";
import { useEffect } from "react";

const LocalVideoView = (props) => {
  const { localStream } = props;
  const localVideoRef = React.useRef();

  useEffect(() => {
    if (localStream) {
      const localVideo = localVideoRef.current;
      localVideo.srcObject = localStream;

      localVideo.onloadedmetadata = () => {
        localVideo.play();
      };
    }
  }, [localStream]);
  return (
    <>
      <video ref={localVideoRef} autoPlay muted></video>
    </>
  );
};

export default LocalVideoView;
