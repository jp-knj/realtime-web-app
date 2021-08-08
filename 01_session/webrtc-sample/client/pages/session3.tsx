import React, { useEffect, useRef, useState } from "react";

const Session3: React.FC = () => {
  const textareaSendRef = useRef<HTMLTextAreaElement>(null);
  const textareaReceiveRef = useRef<HTMLTextAreaElement>(null);
  const sendChannelRef = useRef<RTCDataChannel>();
  const receiveChannelRef = useRef<RTCDataChannel>();
  const localPeerConnectionRef = useRef<RTCPeerConnection>();
  const remotePeerConnectionRef = useRef<RTCPeerConnection>();
  const [isStarted, setIsStarted] = useState(false);
  const onClickStart = async () => {
    console.log("UI Event : start btn clicked");

    // 初期化
    localPeerConnectionRef.current = new RTCPeerConnection();
    sendChannelRef.current = localPeerConnectionRef.current.createDataChannel(
      "sendDataChannel"
    );
    localPeerConnectionRef.current.addEventListener(
      "icecandidate",
      (e: RTCPeerConnectionIceEvent) => {
        if (!remotePeerConnectionRef.current) return;
        if (e.candidate) {
          console.log(`candidate : ${e.candidate.candidate}`);
          remotePeerConnectionRef.current
            .addIceCandidate(e.candidate)
            .then(() => {
              console.log("[RemotePeer]: addIceCandidate success.");
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    );

    // Open の時
    sendChannelRef.current.addEventListener("open", () => {
      const textareaSend = textareaSendRef.current;
      if (!textareaSend) return;
      textareaSend.focus();
      setIsStarted(true);
    });

    // Close の時
    sendChannelRef.current.addEventListener("close", () => {
      if (!sendChannelRef.current) return;
      console.log(
        "Closed data channel with label: " + sendChannelRef.current.label
      );
      const textareaSend = textareaSendRef.current;
      const textareaReceive = textareaReceiveRef.current;
      if (!textareaSend || !textareaReceive) return;
      textareaSend.value = "";
      textareaReceive.value = "";
      setIsStarted(false);
    });

    // 初期化
    remotePeerConnectionRef.current = new RTCPeerConnection();
    remotePeerConnectionRef.current.addEventListener(
      "icecandidate",
      (e: RTCPeerConnectionIceEvent) => {
        if (!localPeerConnectionRef.current) return;
        if (e.candidate) {
          console.log(`candidate : ${e.candidate.candidate}`);
          localPeerConnectionRef.current
            .addIceCandidate(e.candidate)
            .then(() => {
              console.log("[RemotePeer]: addIceCandidate success.");
            })
            .catch((error) => {
              console.log(error);
            });
        }
      }
    );

    // テキストデータを受け取る
    remotePeerConnectionRef.current.addEventListener(
      "datachannel",
      (e: RTCDataChannelEvent) => {
        receiveChannelRef.current = e.channel;

        // テキストエリアで受け取る
        receiveChannelRef.current.addEventListener(
          "message",
          (e: MessageEvent) => {
            console.log(`Received Message: ${e.data}`);
            const textareaReceive = textareaReceiveRef.current;
            if (textareaReceive) textareaReceive.value = e.data;
          }
        );
        receiveChannelRef.current.addEventListener("close", () => {
          if (!receiveChannelRef.current) return;
          console.log(
            `Closed data channel with label: ${receiveChannelRef.current.label}`
          );
        });
      }
    );

    // オファーSDPを送信
    const offerDescription = await localPeerConnectionRef.current.createOffer();
    localPeerConnectionRef.current.setLocalDescription(offerDescription);
    console.log("Offer from localPeerConnection \n" + offerDescription.sdp);

    // オファーSDPを受け取り、アンサーSDPを送信
    remotePeerConnectionRef.current.setRemoteDescription(offerDescription);
    const answerDescription = await remotePeerConnectionRef.current.createAnswer();
    remotePeerConnectionRef.current.setLocalDescription(answerDescription);
    console.log("Answer from remotePeerConnection \n" + answerDescription.sdp);

    // アンサーSDPを受け取る
    localPeerConnectionRef.current.setRemoteDescription(answerDescription);
  };

  const onClickSend = async () => {
    console.log("UI Event: send btn clicked");
    const textareaSend = textareaSendRef.current;
    if (!textareaSend || !sendChannelRef.current) return;
    const data = textareaSend.value;
    sendChannelRef.current.send(data);
    console.log("Sent Data: " + data);
  };

  const onClickStop = () => {
    console.log("UI Event: stop btn clicked");
    if (sendChannelRef.current) sendChannelRef.current.close();
    if (receiveChannelRef.current) receiveChannelRef.current.close();
    if (localPeerConnectionRef.current) localPeerConnectionRef.current.close();
    if (remotePeerConnectionRef.current)
      remotePeerConnectionRef.current.close();
  };

  useEffect(() => {
    return () => {
      if (sendChannelRef.current) sendChannelRef.current.close();
      if (receiveChannelRef.current) receiveChannelRef.current.close();
      if (localPeerConnectionRef.current)
        localPeerConnectionRef.current.close();
      if (remotePeerConnectionRef.current)
        remotePeerConnectionRef.current.close();
    };
  }, []);

  return (
    <>
      <h2>Session3</h2>
      <textarea
        ref={textareaSendRef}
        placeholder="Press Start, enter some text, then press Send."
        disabled={!isStarted}
      />
      <textarea ref={textareaReceiveRef} disabled />
      <div>
        <button onClick={onClickStart} disabled={isStarted}>
          Start
        </button>
        <button onClick={onClickSend} disabled={!isStarted}>
          Send
        </button>
        <button onClick={onClickStop} disabled={!isStarted}>
          Stop
        </button>
      </div>
    </>
  );
};

export default Session3;
