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

let globalRTCPeerConnection = null;

// UI
// カメラとマイクのOn/Offのチェックボックスを押すと呼ばれる関数
function checkedCameraOrMicrophone() {
  console.log("UI Event : Camera/Microphone checked.");

  // これまでの状態
  let trackCamera_old = null;
  let trackMicrophone_old = null;
  let bCamera_old = false;
  let bMicrophone_old = false;
  let stream = elementVideoLocal.srcObject;
  if (stream) {
    trackCamera_old = stream.getVideoTracks()[0];
    if (trackCamera_old) {
      bCamera_old = true;
    }
    trackMicrophone_old = stream.getAudioTracks()[0];
    if (trackMicrophone_old) {
      bMicrophone_old = true;
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

  // （チェックボックスの状態の変化があり、かつ、）カメラとマイクのどちらかもしくはどちらもOnの場合

  // 自分のメディアストリームを取得する。
  console.log(
    "Call : navigator.mediaDevices.getUserMedia( video=%s, audio=%s )",
    bCamera_new,
    bMicrophone_new
  );
  navigator.mediaDevices
    .getUserMedia({ video: bCamera_new, audio: bMicrophone_new })
    .then((stream) => {
      // HTML要素へのメディアストリームの設定
      console.log("Call : setStreamToElement( Video_Local, stream )");
      setStreamToElement(elementVideoLocal, stream);
    })
    .catch((error) => {
      // メディアストリームの取得に失敗⇒古いメディアストリームのまま。チェックボックスの状態を戻す。
      console.error("Error : ", error);
      alert("Could not start Camera.");
      elementCheckboxCamera.checked = false;
      elementCheckboxMicrophone.checked = false;
      return;
    });
}

function clickedCreateOfferSDP() {
  console.log("UI Event : 'Create Offer SDP.' clicked.");
  if (globalRTCPeerConnection) {
    // 既にコネクションオブジェクトあり
    alert("Connection object already exists.");
    return;
  }

  // コンソールに出力する(RTCPeerConnectionオブジェクトの作成する関数を呼び出し)
  console.log("Call : createPeerConnection()");
  let rtcPeerConnection = createPeerConnection(elementVideoLocal.srcObject);
  globalRTCPeerConnection = rtcPeerConnection; // グローバル変数に設定

  // RTCPeerConnectionオブジェクトの作成する関数を呼び出し
  createOfferSDP(rtcPeerConnection);
}

// RTCPeerConnectionオブジェクトの作成する関数
function createPeerConnection(stream) {
  // RTCPeerConnectionオブジェクトの生成
  let config = { iceServers: [] };
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
      // Trickle ICEの場合は、初期SDPを相手に送る
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
      // Vanilla ICEの場合は、まだSDPを相手に送らない
      // Trickle ICEの場合は、初期SDPを相手に送る
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
      // Trickle ICEの場合は、ICE candidateを相手に送る
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
      // Vanilla ICEの場合は、ICE candidateを含んだOfferSDP/AnswerSDPを相手に送る
      // Trickle ICEの場合は、何もしない

      if ("offer" === rtcPeerConnection.localDescription.type) {
        // Offer側のOfferSDP用のテキストエリアに貼付
        console.log("- Set OfferSDP in textarea");
        elementOfferSideOfOfferSDP.value =
          rtcPeerConnection.localDescription.sdp;
        elementOfferSideOfOfferSDP.focus();
        elementOfferSideOfOfferSDP.select();
      } else if ("answer" === rtcPeerConnection.localDescription.type) {
        // Answer側のAnswerSDP用のテキストエリアに貼付
        console.log("- Set AnswerSDP in textarea");
        elementAnswerSideOfAnswerSDP.value =
          rtcPeerConnection.localDescription.sdp;
        elementAnswerSideOfAnswerSDP.focus();
        elementAnswerSideOfAnswerSDP.select();
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

// 「アンサーSDPを準備し、チャットをはじめる」ボタンを押すと呼ばれる関数
function clickedSetAnswerSDPthenChatStarts() {
  console.log(
    "UI Event : 'アンサーSDPを準備し、チャットをはじめる' button clicked."
  );

  if (!globalRTCPeerConnection) {
    // コネクションオブジェクトがない
    alert("Connection object does not exist.");
    return;
  }

  // アンサーSDPを、テキストエリアから取得
  let strAnswerSDP = elementOfferSideOfAnswerSDP.value;
  if (!strAnswerSDP) {
    // AnswerSDPが空
    alert("AnswerSDP is empty. Please enter the AnswerSDP.");
    return;
  }

  // AnswerSDPの設定
  let sessionDescription = new RTCSessionDescription({
    type: "answer",
    sdp: strAnswerSDP,
  });
  console.log("Call : setAnswerSDP()");
  setAnswerSDP(globalRTCPeerConnection, sessionDescription);
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
      // Offer側のOfferSDP用のテキストエリアに貼付
      console.log("- Set OfferSDP in textarea");
      elementOfferSideOfOfferSDP.value = rtcPeerConnection.localDescription.sdp;
      elementOfferSideOfOfferSDP.focus();
      elementOfferSideOfOfferSDP.select();
    } else if ("answer" === rtcPeerConnection.localDescription.type) {
      // Answer側のAnswerSDP用のテキストエリアに貼付
      console.log("- Set AnswerSDP in textarea");
      elementAnswerSideOfAnswerSDP.value =
        rtcPeerConnection.localDescription.sdp;
      elementAnswerSideOfAnswerSDP.focus();
      elementAnswerSideOfAnswerSDP.select();
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
