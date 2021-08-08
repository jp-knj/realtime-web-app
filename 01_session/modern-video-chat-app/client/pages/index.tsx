import React, { useEffect, useRef, useState } from "react";

const Home: React.FC = () => {
  const constraints = {
    audio: true,
    video: true,
  };

  const [camera, setCamera] = useState(false);
  const [mic, setMic] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);

  //画面がロードされたタイミングでwebカメラに接続
  useEffect(() => {
    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      localVideoRef.current!.srcObject = stream;
    });
  }, []);

  // on/offボタンの実装
  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ audio: mic ? false : true, video: true })
      .then((stream) => {
        localVideoRef.current!.srcObject = camera ? null : stream;
      });
  }, [mic, camera]);

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
      ></video>
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
              <button>オファーSDP作成</button>
              <br />
              <textarea></textarea>
            </td>
            <td>
              <br />
              <textarea></textarea>
            </td>
          </tr>
          <tr>
            <td>アンサーSDP</td>
            <td>
              <br />
              <textarea></textarea>
              <br />
              <button>アンサーSDPの準備 と チャット</button>
            </td>
            <td>
              <button>オファーSDPの準備 と アンサーSDP作成.</button>
              <br />
              <textarea></textarea>
              <br />
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default Home;
