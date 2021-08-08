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

  const constraints = { video: true };
  const onClickStart = async () => {
    console.log("UI Event: start btn clicked");

    // ユーザがビデオを許可している時のみ、MediaStreamTrackを登録する
    localStreamRef.current = await navigator.mediaDevices.getUserMedia(
      constraints
    );
    localVideoRef.current!.srcObject = localStreamRef.current;
    setIsStarted(true);
  };

  const onClickCall = async () => {
    console.log("UI Event: call btn clicked");
    setIsCalling(true);
    if (!localStreamRef.current) return;
    const videoTracks = localStreamRef.current.getVideoTracks();
    // 初期化
    localPeerConnectionRef.current = new RTCPeerConnection();
    localPeerConnectionRef.current.addEventListener(
      "icecandidate",
      (e: RTCPeerConnectionIceEvent) => {
        const iceCandidate = e.candidate;
        if (iceCandidate) {
          if (!remotePeerConnectionRef.current) return;
          remotePeerConnectionRef.current
            .addIceCandidate(iceCandidate)
            .then(() => {
              console.log("[RemotePeer]: addIceCandidate success.");
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    );

    // 初期化
    remotePeerConnectionRef.current = new RTCPeerConnection();
    remotePeerConnectionRef.current.addEventListener(
      "icecandidate",
      (e: RTCPeerConnectionIceEvent) => {
        const iceCandidate = e.candidate;
        if (iceCandidate) {
          if (!localPeerConnectionRef.current) return;
          localPeerConnectionRef.current
            .addIceCandidate(iceCandidate)
            .then(() => {
              console.log("[LocalPeer]: addIceCandidate success.");
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    );

    // メディアストリームを受け取った時
    remotePeerConnectionRef.current.addEventListener(
      "track",
      (e: RTCTrackEvent) => {
        console.log("Event : ontrack");
        if (!remoteVideoRef.current) return;
        if (e.streams && e.streams[0]) return;
        remoteStreamRef.current = new MediaStream();
        remoteStreamRef.current.addTrack(e.track);
        remoteVideoRef.current.srcObject = remoteStreamRef.current;
      }
    );

    localPeerConnectionRef.current.addTrack(videoTracks[0]);
    const offerDescription = await localPeerConnectionRef.current.createOffer({
      offerToReceiveVideo: true,
    });

    // オファーを受け取ったらそれをリモートのSDPとして登録
    localPeerConnectionRef.current
      .setLocalDescription(offerDescription)
      .then(() => {
        console.log("[LocalPeer]: setLocalDescription success");
      })
      .catch((error) => {
        console.log(error);
      });

    // オファーを受け取ったらそれをリモートのSDPとして登録
    remotePeerConnectionRef.current
      .setRemoteDescription(offerDescription)
      .then(() => {
        console.log("[RemotePeer]: setRemoteDescription success");
      })
      .catch((error) => {
        console.log(error);
      });

    // アンサーSDPを受け取る
    const answerDescription = await remotePeerConnectionRef.current.createAnswer();
    remotePeerConnectionRef.current
      .setLocalDescription(answerDescription)
      .then(() => {
        console.log("[RemotePeer]: setLocalDescription success");
      })
      .catch((error) => {
        console.log(error);
      });
    localPeerConnectionRef.current
      .setRemoteDescription(answerDescription)
      .then(() => {
        console.log("[LocalPeer]: setRemoteDescription success");
      })
      .catch((error) => {
        console.log(error);
      });
    console.log(localPeerConnectionRef.current);
    console.log(remotePeerConnectionRef.current);
  };

  const onClickHangUp = () => {
    console.log("UI Event: hangup btn clicked");
    setIsCalling(false);
    if (localPeerConnectionRef.current) localPeerConnectionRef.current.close();
    if (remotePeerConnectionRef.current)
      remotePeerConnectionRef.current.close();
  };
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
        <button onClick={onClickStart}>Start</button>
        <button onClick={onClickCall}>Call</button>
        <button onClick={onClickHangUp}>Hang Up</button>
      </div>
    </div>
  );
};

export default Session2;
