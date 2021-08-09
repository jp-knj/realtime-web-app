import React, { useState } from "react";

type Props = {
  localVideoRef: React.RefObject<HTMLVideoElement>;
};
const Signaling: React.FC<Props> = (localVideoRef) => {
  const handleOfferSDP = () => {
    console.log("UI Event : 'オファーSDPの作成' button clicked.");
    localVideoRef.srcObject = srcObject;
    let rtcPeerConnection = createPeerConnection(localVideoRef.srcObject);
  };

  function createPeerConnection(stream: any) {
    // RTCPeerConnectionオブジェクトの生成
    let config = { iceServers: [] };
    let rtcPeerConnection = new RTCPeerConnection(config);

    // RTCPeerConnectionオブジェクトのイベントハンドラの構築
    // setupRTCPeerConnectionEventHandler(rtcPeerConnection);

    // RTCPeerConnectionオブジェクトのストリームにローカルのメディアストリームを追加
    if (stream) {
      stream.getTracks().forEach((track: any) => {
        rtcPeerConnection.addTrack(track, stream);
      });
    } else {
      console.log("No local stream.");
    }
    return rtcPeerConnection;
  }

  function createOfferSDP(rtcPeerConnection: any) {
    // OfferSDPの作成
    console.log("Call : rtcPeerConnection.createOffer()");
    rtcPeerConnection
      .createOffer()
      .then((sessionDescription: any) => {
        // 作成されたOfferSDPををLocalDescriptionに設定
        console.log("Call : rtcPeerConnection.setLocalDescription()");
        return rtcPeerConnection.setLocalDescription(sessionDescription);
      })
      .then(() => {
        // Vanilla ICEの場合は、まだSDPを相手に送らない
        // Trickle ICEの場合は、初期SDPを相手に送る
      })
      .catch((error: any) => {
        console.error("Error : ", error);
      });
  }

  return (
    <table>
      <tbody>
        <tr>
          <td></td>
          <td>オファー側</td>
          <td>アンサー側</td>
        </tr>
        <tr>
          <td>オファーSDP</td>
          <td>
            <button onClick={handleOfferSDP}>オファーSDPの作成</button>
            <br />
            <textarea id="textarea_offerside_offsersdp"></textarea>
          </td>
          <td>
            <br />
            <textarea id="textarea_answerside_offsersdp"></textarea>
          </td>
        </tr>
        <tr>
          <td>アンサーSDP</td>
          <td>
            <br />
            <textarea id="textarea_offerside_answersdp"></textarea>
            <br />
            <button>アンサーSDPを準備、チャットをはじめるよ</button>
          </td>
          <td>
            <button>オファーSDPの準備 と アンサーSDPの作成.</button>
            <br />
            <textarea id="textarea_answerside_answersdp"></textarea>
            <br />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default Signaling;
