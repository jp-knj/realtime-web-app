import React from "react";
import { useEffect } from "react";

const RemoteVideoView = (props) => {
  const { remoteStream } = props;
  const remoteVideoRef = React.useRef();

  useEffect(() => {
    if (remoteStream) {
      const remoteVideo = remoteVideoRef.current;
      remoteVideo.srcObject = remoteStream;

      remoteVideo.onloadedmetadata = () => {
        remoteVideo.play();
      };
    }
  }, [remoteStream]);
  return (
    <>
      <video ref={remoteVideoRef} autoPlay muted></video>
    </>
  );
};

export default RemoteVideoView;
