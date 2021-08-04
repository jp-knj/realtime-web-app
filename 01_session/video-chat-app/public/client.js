"use strict"; // 厳格モードとする

// カメラとマイクの On/Off
const elementCheckboxCamera = document.getElementById("checkedCamera");
const elementCheckboxMicrophone = document.getElementById("checkedMicrophone");

// オファー側/アンサー側のオファーSDP/アンサーSDPのテキストエリア
const elementOfferSideOfOfferSDP = document.getElementById(
  "offersideOfoffsersdp"
);
const elementAnswerSideOfOfferSDP = document.getElementById(
  "answersideOfoffsersdp"
);
const elementOfferSideOfAnswerSDP = document.getElementById(
  "offersideOfanswersdp"
);
const elementAnswerSideOfAnswerSDP = document.getElementById(
  "answersideOfanswersdp"
);

// ローカルのメディア要素
const elementVideoLocal = document.getElementById("videoLocal");

// リモートのメディア要素
const elementVideoRemote = document.getElementById("videoRemote");
const elementAudioRemote = document.getElementById("audioRemote");

// メッセージのインプットとテキストエリア
const elementSendMessage = document.getElementById("sendMessage");
const elementReceivedMessage = document.getElementById("receivedMessage");

// クライアントからサーバーへの接続要求
const globalSocket = io.connect();

let globalRTCPeerConnection = null;

// UI
// // ページがunloadされる（閉じる、再読み込み、別ページへ移動）直前に呼ばれる関数
window.addEventListener("beforeunload", (event) => {
  event.preventDefault(); // 既定の動作のキャンセル

  clickedLeaveChat(); // チャットからの離脱
  globalSocket.disconnect(); // Socket.ioによるサーバーとの接続の切断

  e.returnValue = ""; // Chrome では returnValue を設定する必要がある
  return ""; // Chrome 以外では、return を設定する必要がある
});

// カメラとマイクのOn/Offのチェックボックスを押すと呼ばれる関数
function checkedCameraOrMicrophone() {
  console.log("UI Event : Camera/Microphone checked.");

  // これまでの状態
  let trackCamera_old = null;
  let trackMicrophone_old = null;
  let bCamera_old = false;
  let bMicrophone_old = false;
  let idCameraTrack_old = "";
  let idMicrophoneTrack_old = "";
  let stream = elementVideoLocal.srcObject;
  if (stream) {
    trackCamera_old = stream.getVideoTracks()[0];
    if (trackCamera_old) {
      bCamera_old = true;
      idCameraTrack_old = trackCamera_old.id;
    }
    trackMicrophone_old = stream.getAudioTracks()[0];
    if (trackMicrophone_old) {
      bMicrophone_old = true;
      idMicrophoneTrack_old = trackMicrophone_old.id;
    }
  }

  // 今後の状態
  let bCamera_new = false;
  if (elementCheckboxCamera.checked) {
    bCamera_new = true;
  }
  let bMicrophone_new = false;
  if (elementCheckboxMicrophone.checked) {
    bMicrophone_new = true;
  }

  // 状態変化
  console.log("Camera :  %s => %s", bCamera_old, bCamera_new);
  console.log("Microphoneo : %s = %s", bMicrophone_old, bMicrophone_new);

  if (bCamera_old === bCamera_new && bMicrophone_old === bMicrophone_new) {
    // チェックボックスの状態の変化なし
    return;
  }

  if (globalRTCPeerConnection) {
    // コネクションオブジェクトに対してTrack削除を行う。
    // （コネクションオブジェクトに対してTrack削除を行わなかった場合、使用していないstream通信が残る。）
    let senders = globalRTCPeerConnection.getSenders();
    senders.forEach((sender) => {
      if (sender.track) {
        if (
          idCameraTrack_old === sender.track.id ||
          idMicrophoneTrack_old === sender.track.id
        ) {
          globalRTCPeerConnection.removeTrack(sender);
          // removeTrack()の結果として、通信相手に、streamの「removetrack」イベントが発生する。
        }
      }
    });
  }
  // 古いメディアストリームのトラックの停止（トラックの停止をせず、HTML要素のstreamの解除だけではカメラは停止しない（カメラ動作LEDは点いたまま））
  if (trackCamera_old) {
    console.log("Call : trackCamera_old.stop()");
    trackCamera_old.stop();
  }
  if (trackMicrophone_old) {
    console.log("Call : trackMicrophone_old.stop()");
    trackMicrophone_old.stop();
  }
  // HTML要素のメディアストリームの解除
  console.log("Call : setStreamToElement( Video_Local, null )");
  setStreamToElement(elementVideoLocal, null);

  if (!bCamera_new && !bMicrophone_new) {
    // （チェックボックスの状態の変化があり、かつ、）カメラとマイクを両方Offの場合
    return;
  }

  // 古いメディアストリームのトラックの停止（トラックの停止をせず、HTML要素のstreamの解除だけではカメラは停止しな（・・・略・・・）

  // 自分のメディアストリームを取得する。
  // - 古くは、navigator.getUserMedia() を使用していたが、廃止された。
  //   現在は、navigator.mediaDevices.getUserMedia() が新たに用意され、これを使用する。
  console.log(
    "Call : navigator.mediaDevices.getUserMedia( video=%s, audio=%s )",
    bCamera_new,
    bMicrophone_new
  );
  navigator.mediaDevices
    .getUserMedia({ video: bCamera_new, audio: bMicrophone_new })
    .then((stream) => {
      if (globalRTCPeerConnection) {
        // コネクションオブジェクトに対してTrack追加を行う。
        stream.getTracks().forEach((track) => {
          globalRTCPeerConnection.addTrack(track, stream);
          // addTrac()の結果として、「Negotiation needed」イベントが発生する。
        });
      }

      // HTML要素へのメディアストリームの設定
      console.log("Call : setStreamToElement( Video_Local, stream )");
      setStreamToElement(elementVideoLocal, stream);
    });
}

function clickedSendOfferSDP() {
  console.log("UI Event : 'オファーSDPをおくる.' button clicked.");

  if (globalRTCPeerConnection) {
    // 既にコネクションオブジェクトあり
    alert("Connection object already exists.");
    return;
  }

  // RTCPeerConnectionオブジェクトの作成
  console.log("Call : createPeerConnection()");
  let rtcPeerConnection = createPeerConnection(elementVideoLocal.srcObject);
  globalRTCPeerConnection = rtcPeerConnection; // グローバル変数に設定

  // DataChannelの作成
  let datachannel = rtcPeerConnection.createDataChannel("my datachannel");
  // DataChannelオブジェクトをRTCPeerConnectionオブジェクトのメンバーに追加。
  rtcPeerConnection.datachannel = datachannel;
  // DataChannelオブジェクトのイベントハンドラの構築
  console.log("Call : setupDataChannelEventHandler()");
  setupDataChannelEventHandler(rtcPeerConnection);

  // OfferSDPの作成
  createOfferSDP(rtcPeerConnection);
}

// メッセージをおくる ボタンを押すと呼ばれる関数
function handleSendMessage() {
  console.log("UI Event : 'メッセージをおくる' button clicked.");

  if (!globalRTCPeerConnection) {
    // コネクションオブジェクトがない
    alert("Connection object does not exist.");
    return;
  }
  if (!isDataChannelOpen(globalRTCPeerConnection)) {
    // DataChannelオブジェクトが開いていない
    alert("Datachannel is not open.");
    return;
  }

  if (!elementSendMessage.value) {
    alert("Message for send is empty. Please enter the message for send.");
    return;
  }

  // メッセージをDataChannelを通して相手に直接送信
  console.log("- Send Message through DataChannel");
  globalRTCPeerConnection.datachannel.send(
    JSON.stringify({ type: "message", data: elementSendMessage.value })
  );
  elementReceivedMessage.value += elementSendMessage.value + "\n"; // 一番下に追加
  elementSendMessage.value = "";
}

function clickedLeaveChat() {
  console.log("UI Event :'チャットからはなれる' button clicked.");

  if (globalRTCPeerConnection) {
    if (isDataChannelOpen(globalRTCPeerConnection)) {
      // チャット中
      // チャット離脱の通知をDataChannelを通して相手に直接送信
      console.log("- Send 'leave' through DataChannel");
      globalRTCPeerConnection.datachannel.send(
        JSON.stringify({ type: "leave", data: "" })
      );
    }
    console.log("Call : endPeerConnection()");
    endPeerConnection(globalRTCPeerConnection);
  }
}

// コネクションの終了処理
function endPeerConnection(rtcPeerConnection) {
  // リモート映像の停止
  console.log("Call : setStreamToElement( VideoRemote, null )");
  setStreamToElement(elementVideoRemote, null);
  // リモート音声の停止
  console.log("Call : setStreamToElement( AudioRemote, null )");
  setStreamToElement(elementAudioRemote, null);

  // グローバル変数のクリア
  globalRTCPeerConnection = null;

  // ピアコネクションの終了
  rtcPeerConnection.close();
}

// コネクションの終了処理
function endPeerConnection(rtcPeerConnection) {
  // リモート映像の停止
  console.log("Call : setStreamToElement( VideoRemote, null )");
  setStreamToElement(elementVideoRemote, null);
  // リモート音声の停止
  console.log("Call : setStreamToElement( AudioRemote, null )");
  setStreamToElement(elementAudioRemote, null);

  // DataChannelの終了
  if ("datachannel" in rtcPeerConnection) {
    rtcPeerConnection.datachannel.close();
    rtcPeerConnection.datachannel = null;
  }

  // グローバル変数から解放
  globalRTCPeerConnection = null;

  // ピアコネクションの終了
  rtcPeerConnection.close();
}

// RTCPeerConnectionオブジェクトの作成する関数
function createPeerConnection(stream) {
  // RTCPeerConnectionオブジェクトの生成
  let config = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
    ],
  };
  let rtcPeerConnection = new RTCPeerConnection(config);

  // RTCPeerConnectionオブジェクトのイベントハンドラの構築
  setupRTCPeerConnectionEventHandler(rtcPeerConnection);

  // RTCPeerConnectionオブジェクトのストリームにローカルのメディアストリームを追加
  if (stream) {
    stream.getTracks().forEach((track) => {
      rtcPeerConnection.addTrack(track, stream);
    });
  } else {
    console.log("No local stream.");
  }
  return rtcPeerConnection;
}

// Socket.IO
// 接続時の処理
// ・サーバーとクライアントの接続が確立すると、
// 　サーバー側で、"connection"イベント、クライアント側で、"connect"イベントが発生する
globalSocket.on("connect", () => {
  console.log("Socket Event : connect");
});

// サーバーからのメッセージ受信に対する処理
// ・サーバー側のメッセージ拡散時の「io.broadcast.emit( "signaling", objData );」に対する処理
globalSocket.on("signaling", (objData) => {
  console.log("Socket Event : signaling");
  console.log("- type : ", objData.type);
  console.log("- data : ", objData.data);

  if ("offer" === objData.type) {
    // 設定するOffserSDPとして、テキストエリアのデータではなく、受信したデータを使用する。
    if (globalRTCPeerConnection) {
      // 既にコネクションオブジェクトあり
      alert("Connection object already exists.");
      return;
    }
    // RTCPeerConnectionオブジェクトの作成
    console.log("Call : createPeerConnection()");
    let rtcPeerConnection = createPeerConnection(elementVideoLocal.srcObject);
    globalRTCPeerConnection = rtcPeerConnection; // グローバル変数に設定
    // OfferSDPの設定とAnswerSDPの作成
    console.log("Call : setOfferSDPandCreateAnswerSDP()");
    setOfferSDPAndCreateAnswerSDP(rtcPeerConnection, objData.data); // 受信したSDPオブジェクトを渡す。
  } else if ("answer" === objData.type) {
    if (!globalRTCPeerConnection) {
      // コネクションオブジェクトがない
      alert("Connection object does not exist.");
      return;
    }
    // AnswerSDPの設定
    console.log("Call : setAnswerSDP()");
    setAnswerSDP(globalRTCPeerConnection, objData.data); // 受信したSDPオブジェクトを渡す。
  } else if ("candidate" === objData.type) {
    if (!globalRTCPeerConnection) {
      // コネクションオブジェクトがない
      alert("Connection object does not exist.");
      return;
    }
    // ICE candidateの追加
    console.log("Call : addCandidate()");
    addCandidate(globalRTCPeerConnection, objData.data); // 受信したICE candidateの追加
  } else {
    console.error("Unexpected : Socket Event : signaling");
  }
});

// DataChannelが開いているか
function isDataChannelOpen(rtcPeerConnection) {
  if (!("datachannel" in rtcPeerConnection)) {
    // datachannelメンバーが存在しない
    return false;
  }
  if (!rtcPeerConnection.datachannel) {
    // datachannelメンバーがnull
    return false;
  }
  if ("open" !== rtcPeerConnection.datachannel.readyState) {
    // datachannelメンバーはあるが、"open"でない。
    return false;
  }
  // DataCchannelが開いている
  return true;
}
// DataChannelオブジェクトのイベントハンドラの構築
function setupDataChannelEventHandler(rtcPeerConnection) {
  if (!("datachannel" in rtcPeerConnection)) {
    console.error("Unexpected : DataChannel does not exist.");
    return;
  }

  // message イベントが発生したときのイベントハンドラ
  rtcPeerConnection.datachannel.onmessage = (event) => {
    console.log("DataChannel Event : message");
    let objData = JSON.parse(event.data);
    console.log("- type : ", objData.type);
    console.log("- data : ", objData.data);

    if ("message" === objData.type) {
      // 受信メッセージをメッセージテキストエリアへ追加
      let strMessage = objData.data;
      elementReceivedMessage.value += strMessage + "\n";
    } else if ("offer" === objData.type) {
      // 受信したOfferSDPの設定とAnswerSDPの作成
      console.log("Call : setOfferSDP_and_createAnswerSDP()");
      setOfferSDPAndCreateAnswerSDP(rtcPeerConnection, objData.data);
    } else if ("answer" === objData.type) {
      // 受信したAnswerSDPの設定
      console.log("Call : setAnswerSDP()");
      setAnswerSDP(rtcPeerConnection, objData.data);
    } else if ("candidate" === objData.type) {
      // 受信したICE candidateの追加
      console.log("Call : addCandidate()");
      addCandidate(rtcPeerConnection, objData.data);
    } else if ("leave" === objData.type) {
      console.log("Call : endPeerConnection()");
      endPeerConnection(rtcPeerConnection);
    }
  };
}

// RTCPeerConnection関連
// OfferSDPの作成
function createOfferSDP(rtcPeerConnection) {
  // OfferSDPの作成
  console.log("Call : rtcPeerConnection.createOffer()");
  rtcPeerConnection
    .createOffer()
    .then((sessionDescription) => {
      // 作成されたOfferSDPををLocalDescriptionに設定
      console.log("Call : rtcPeerConnection.setLocalDescription()");
      return rtcPeerConnection.setLocalDescription(sessionDescription);
    })
    .then(() => {
      if (!isDataChannelOpen(rtcPeerConnection)) {
        // チャット前
        // 初期OfferSDPをサーバーを経由して相手に送信
        console.log("- Send OfferSDP to server");
        globalSocket.emit("signaling", {
          type: "offer",
          data: rtcPeerConnection.localDescription,
        });
      } else {
        // チャット中
        // 初期OfferSDPをDataChannelを通して相手に直接送信
        console.log("- Send OfferSDP through DataChannel");
        rtcPeerConnection.datachannel.send(
          JSON.stringify({
            type: "offer",
            data: rtcPeerConnection.localDescription,
          })
        );
      }
    })
    .catch((error) => {
      console.error("Error : ", error);
    });
}

function setOfferSDPAndCreateAnswerSDP(rtcPeerConnection, sessionDescription) {
  console.log("Call : rtcPeerConnection.setRemoteDescription()");
  rtcPeerConnection
    .setRemoteDescription(sessionDescription)
    .then(() => {
      // AnswerSDPの作成
      console.log("Call : rtcPeerConnection.createAnswer()");
      return rtcPeerConnection.createAnswer();
    })
    .then((sessionDescription) => {
      // 作成されたAnswerSDPををLocalDescriptionに設定
      console.log("Call : rtcPeerConnection.setLocalDescription()");
      return rtcPeerConnection.setLocalDescription(sessionDescription);
    })
    .then(() => {
      if (!isDataChannelOpen(rtcPeerConnection)) {
        // チャット前
        // 初期AnswerSDPをサーバーを経由して相手に送信
        console.log("- Send AnswerSDP to server");
        globalSocket.emit("signaling", {
          type: "answer",
          data: rtcPeerConnection.localDescription,
        });
      } else {
        // チャット中
        // 初期AnswerSDPをDataChannelを通して相手に直接送信
        console.log("- Send AnswerSDP through DataChannel");
        rtcPeerConnection.datachannel.send(
          JSON.stringify({
            type: "answer",
            data: rtcPeerConnection.localDescription,
          })
        );
      }
    })
    .catch((error) => {
      console.error("Error : ", error);
    });
}

// AnswerSDPの設定
function setAnswerSDP(rtcPeerConnection, sessionDescription) {
  console.log("Call : rtcPeerConnection.setRemoteDescription()");
  rtcPeerConnection.setRemoteDescription(sessionDescription).catch((error) => {
    console.error("Error : ", error);
  });
}

function addCandidate(rtcPeerConnection, candidate) {
  console.log("Call : rtcPeerConnection.addIceCandidate()");
  rtcPeerConnection.addIceCandidate(candidate).catch((error) => {
    console.error("Error : ", error);
  });
}

// RTCPeerConnectionオブジェクトのイベントハンドラの構築
function setupRTCPeerConnectionEventHandler(rtcPeerConnection) {
  // Negotiation needed イベントが発生したときのイベントハンドラ
  // - このイベントは、セッションネゴシエーションを必要とする変更が発生したときに発生する。
  //   一部のセッション変更はアンサーとしてネゴシエートできないため、このネゴシエーションはオファー側として実行されなければならない。
  //   最も一般的には、negotiationneededイベントは、RTCPeerConnectionに送信トラックが追加された後に発生する。
  //   ネゴシエーションがすでに進行しているときに、ネゴシエーションを必要とする方法でセッションが変更された場合、
  //   ネゴシエーションが完了するまで、negotiationneededイベントは発生せず、ネゴシエーションがまだ必要な場合にのみ発生する。
  //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onnegotiationneeded
  rtcPeerConnection.onnegotiationneeded = () => {
    console.log("Event : Negotiation needed");

    if (!isDataChannelOpen(rtcPeerConnection)) {
      // チャット前
      // OfferSDPの作成は、ユーザーイベントから直接呼び出すので、
      // Negotiation Neededイベントは無視する。
    } else {
      // チャット中
      // OfferSDPを作成し、DataChannelを通して相手に直接送信
      console.log("Call : createOfferSDP()");
      createOfferSDP(rtcPeerConnection);
    }
  };

  // ICE candidate イベントが発生したときのイベントハンドラ
  // - これは、ローカルのICEエージェントがシグナリング・サーバを介して
  //   他のピアにメッセージを配信する必要があるときはいつでも発生する。
  //   これにより、ブラウザ自身がシグナリングに使用されている技術についての詳細を知る必要がなく、
  //   ICE エージェントがリモートピアとのネゴシエーションを実行できるようになる。
  //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onicecandidate
  rtcPeerConnection.onicecandidate = (event) => {
    console.log("Event : ICE candidate");
    if (event.candidate) {
      // ICE candidateがある
      console.log("- ICE candidate : ", event.candidate);
      if (!isDataChannelOpen(rtcPeerConnection)) {
        // チャット前
        // ICE candidateをサーバーを経由して相手に送信
        console.log("- Send ICE candidate to server");
        globalSocket.emit("signaling", {
          type: "candidate",
          data: event.candidate,
        });
      } else {
        // チャット中
        // ICE candidateをDataChannelを通して相手に直接送信
        console.log("- Send ICE candidate through DataChannel");
        rtcPeerConnection.datachannel.send(
          JSON.stringify({ type: "candidate", data: event.candidate })
        );
      }
    } else {
      // ICE candiateがない = ICE candidate の収集終了。
      console.log("- ICE candidate : empty");
    }
  };

  // ICE candidate error イベントが発生したときのイベントハンドラ
  // - このイベントは、ICE候補の収集処理中にエラーが発生した場合に発生する。
  //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onicecandidateerror
  rtcPeerConnection.onicecandidateerror = (event) => {
    console.error(
      "Event : ICE candidate error. error code : ",
      event.errorCode
    );
  };

  // ICE gathering state change イベントが発生したときのイベントハンドラ
  // - このイベントは、ICE gathering stateが変化したときに発生する。
  //   言い換えれば、ICEエージェントがアクティブに候補者を収集しているかどうかが変化したときに発生する。
  //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onicegatheringstatechange
  rtcPeerConnection.onicegatheringstatechange = () => {
    console.log("Event : ICE gathering state change");
    console.log(
      "- ICE gathering state : ",
      rtcPeerConnection.iceGatheringState
    );
    if ("complete" === rtcPeerConnection.iceGatheringState) {
      if ("offer" === rtcPeerConnection.localDescription.type) {
      } else if ("answer" === rtcPeerConnection.localDescription.type) {
      } else {
        console.error(
          "Unexpected : Unknown localDescription.type. type = ",
          rtcPeerConnection.localDescription.type
        );
      }
    }
  };

  // ICE connection state change イベントが発生したときのイベントハンドラ
  // - このイベントは、ネゴシエーションプロセス中にICE connection stateが変化するたびに発生する。
  // - 接続が成功すると、通常、状態は「new」から始まり、「checking」を経て、「connected」、最後に「completed」と遷移します。
  //   ただし、特定の状況下では、「connected」がスキップされ、「checking」から「completed」に直接移行する場合があります。
  //   これは、最後にチェックされた候補のみが成功した場合に発生する可能性があり、成功したネゴシエーションが完了する前に、
  //   収集信号と候補終了信号の両方が発生します。
  //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/iceconnectionstatechange_event
  rtcPeerConnection.oniceconnectionstatechange = () => {
    console.log("Event : ICE connection state change");
    console.log(
      "- ICE connection state : ",
      rtcPeerConnection.iceConnectionState
    );
    // "disconnected" : コンポーネントがまだ接続されていることを確認するために、RTCPeerConnectionオブジェクトの少なくとも
    //                  1つのコンポーネントに対して失敗したことを確認します。これは、"failed "よりも厳しいテストではなく、
    //                  断続的に発生し、信頼性の低いネットワークや一時的な切断中に自然に解決することがあります。問題が
    //                  解決すると、接続は "接続済み "の状態に戻ることがあります。
    // "failed"       : ICE candidateは、すべての候補のペアを互いにチェックしたが、接続のすべてのコンポーネントに
    //                  互換性のあるものを見つけることができなかった。しかし、ICEエージェントがいくつかの
    //                  コンポーネントに対して互換性のある接続を見つけた可能性がある。
    // see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/iceConnectionState
  };

  // Signaling state change イベントが発生したときのイベントハンドラ
  // - このイベントは、ピア接続のsignalStateが変化したときに送信される。
  //   これは、setLocalDescription（）またはsetRemoteDescription（）の呼び出しが原因で発生する可能性がある。
  //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onsignalingstatechange
  rtcPeerConnection.onsignalingstatechange = () => {
    console.log("Event : Signaling state change");
    console.log("- Signaling state : ", rtcPeerConnection.signalingState);
  };

  // Connection state change イベントが発生したときのイベントハンドラ
  // - このイベントは、ピア接続の状態が変化したときに送信される。
  //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onconnectionstatechange
  rtcPeerConnection.onconnectionstatechange = () => {
    console.log("Event : Connection state change");
    console.log("- Connection state : ", rtcPeerConnection.connectionState);
    // "disconnected" : 接続のためのICEトランスポートの少なくとも1つが「disconnected」状態であり、
    //                  他のトランスポートのどれも「failed」、「connecting」、「checking」の状態ではない。
    // "failed"       : 接続の1つ以上のICEトランスポートが「失敗」状態になっている。
    // see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/connectionState

    if ("failed" === rtcPeerConnection.connectionState) {
      // 「ビデオチャット相手との通信が切断」が「しばらく」続き、通信が復帰しないとき、Connection state「failed」となる。
      // - 「ビデオチャット相手との通信が切断」になると「すぐに」Connection state「failed」となるわけではない。
      // - 相手のチャット離脱後、速やかにコネクション終了処理を行うためには、離脱側からチャット離脱メッセージを送信し、受信側でコネクション終了処理を行うようにする。
      console.log("Call : endPeerConnection()");
      endPeerConnection(rtcPeerConnection);
    }
  };

  // Track イベントが発生したときのイベントハンドラ
  // - このイベントは、新しい着信MediaStreamTrackが作成され、
  //   コネクション上のレシーバーセットに追加されたRTCRtpReceiverオブジェクトに関連付けられたときに送信される。
  //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/ontrack
  //   現在は、rtcPeerConnection.ontrack に設定する。
  rtcPeerConnection.ontrack = (event) => {
    console.log("Event : Track");
    console.log("- stream", event.streams[0]);
    console.log("- track", event.track);

    // HTML要素へのリモートメディアストリームの設定
    let stream = event.streams[0];
    let track = event.track;
    if ("video" === track.kind) {
      console.log("Call : setStreamToElement( VideoRemote, stream )");
      setStreamToElement(elementVideoRemote, stream);
    } else if ("audio" === track.kind) {
      console.log("Call : setStreamToElement( AudioRemote, stream )");
      setStreamToElement(elementAudioRemote, stream);
    } else {
      console.error("Unexpected : Unknown track kind : ", track.kind);
    }
    // 相手のメディアストリームがRTCPeerConnectionから削除されたときのイベントハンドラ
    // - 相手の RTCPeerConnection.removeTrack( sender );
    //   の結果として、streamの「removetrack」イベントが発生する。
    // - 古くは、rtcPeerConnection.onremovetrack に設定していたが、廃止された。
    //   現在は、stream.onremovetrack に設定する。
    stream.onremovetrack = (evt) => {
      console.log("Stream Event : remove track");
      console.log("- stream", stream);
      console.log("- track", evt.track);

      // HTML要素のメディアストリームの解除
      let trackRemove = evt.track;
      if ("video" === trackRemove.kind) {
        console.log("Call : setStreamToElement( Video_Remote, null )");
        setStreamToElement(elementVideoRemote, null);
      } else if ("audio" === trackRemove.kind) {
        console.log("Call : setStreamToElement( Audio_Remote, null )");
        setStreamToElement(elementAudioRemote, null);
      } else {
        console.error("Unexpected : Unknown track kind : ", trackRemove.kind);
      }
    };
  };

  // Data channel イベントが発生したときのイベントハンドラ
  // - このイベントは、createDataChannel() を呼び出すリモートピアによって
  //   RTCDataChannelが接続に追加されたときに送信されます。
  //   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/ondatachannel
  rtcPeerConnection.ondatachannel = (event) => {
    console.log("Event : Data channel");

    // DataChannelオブジェクトをRTCPeerConnectionオブジェクトのメンバーに追加。
    rtcPeerConnection.datachannel = event.channel;
    // DataChannelオブジェクトのイベントハンドラの構築
    console.log("Call : setupDataChannelEventHandler()");
    setupDataChannelEventHandler(rtcPeerConnection);

    // オファーをされた側として、OfferSDPを作成し、DataChannelを通して相手に直接送信
    // （オファーした側でカメラや（orマイク）をOnにしなかった場合、
    //   オファーされた側でカメラ（orマイク）をOnにしても、
    //   カメラ映像（orマイク音声）の通信ストリームは作成されず、カメラ映像（マイク音声）は相手に送信されない。
    //   オファーされた側として、OfferSDPを作成、送信することで、
    //   オファーした側、オファーされた側、双方で必要な通信ストリームが整う。）
    console.log("Call : createOfferSDP()");
    createOfferSDP(rtcPeerConnection);
  };
}

function clickedSetOfferSDPandCreateAnswerSDP() {
  console.log(
    "UI Event : 'オファーSDPの準備とアンサーSDPの作成' button clicked."
  );
  if (globalRTCPeerConnection) {
    // 既にコネクションオブジェクトあり
    alert("Connection object already exists.");
    return;
  }
  // OfferSDPを、テキストエリアから取得
  let strOfferSDP = elementAnswerSideOfOfferSDP.value;
  if (!strOfferSDP) {
    // OfferSDPが空
    alert("OfferSDP is empty. Please enter the OfferSDP.");
    return;
  }
  // RTCPeerConnectionオブジェクトの作成
  console.log("Call : createPeerConnection()");
  let rtcPeerConnection = createPeerConnection(elementVideoLocal.srcObject);
  globalRTCPeerConnection = rtcPeerConnection; // グローバル変数に設定

  // OfferSDPの設定とAnswerSDPの作成
  let sessionDescription = new RTCSessionDescription({
    type: "offer",
    sdp: strOfferSDP,
  });
  console.log("Call : setOfferSDPAndCreateAnswerSDP()");
  setOfferSDPAndCreateAnswerSDP(rtcPeerConnection, sessionDescription);
}

// ICE gathering state change イベントが発生したときのイベントハンドラ
// - このイベントは、ICE gathering stateが変化したときに発生する。
//   言い換えれば、ICEエージェントがアクティブに候補者を収集しているかどうかが変化したときに発生する。
//   see : https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/onicegatheringstatechange
rtcPeerConnection.onicegatheringstatechange = () => {
  console.log("Event : ICE gathering state change");
  console.log("- ICE gathering state : ", rtcPeerConnection.iceGatheringState);

  if ("complete" === rtcPeerConnection.iceGatheringState) {
    // Vanilla ICEの場合は、ICE candidateを含んだOfferSDP/AnswerSDPを相手に送る
    // Trickle ICEの場合は、何もしない
    if ("offer" === rtcPeerConnection.localDescription.type) {
    } else if ("answer" === rtcPeerConnection.localDescription.type) {
    } else {
      console.error(
        "Unexpected : Unknown localDescription.type. type = ",
        rtcPeerConnection.localDescription.type
      );
    }
  }
};

// HTML要素へのメディアストリームの設定（もしくは解除。および開始）
// HTML要素は、「ローカルもしくはリモート」の「videoもしくはaudio」。
// メディアストリームは、ローカルメディアストリームもしくはリモートメディアストリーム、もしくはnull。
// メディアストリームには、Videoトラック、Audioトラックの両方もしくは片方のみが含まれる。
// メディアストリームに含まれるトラックの種別、設定するHTML要素種別は、呼び出し側で対処する。
function setStreamToElement(elementMedia, stream) {
  // メディアストリームを、メディア用のHTML要素のsrcObjに設定する。
  elementMedia.srcObject = stream;

  if (!stream) {
    // メディアストリームの設定解除の場合は、ここで処理終了
    return;
  }

  // 音量
  if ("VIDEO" === elementMedia.tagName) {
    // VIDEO：ボリュームゼロ、ミュート
    elementMedia.volume = 0.0;
    elementMedia.muted = true;
  } else if ("AUDIO" === elementMedia.tagName) {
    // AUDIO：ボリュームあり、ミュートでない
    elementMedia.volume = 1.0;
    elementMedia.muted = false;
  } else {
    console.error(
      "Unexpected : Unknown ElementTagName : ",
      elementMedia.tagName
    );
  }
}
