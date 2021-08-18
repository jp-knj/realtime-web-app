import React from "react";
import { connect } from "react-redux";
import IncomingCallDialog from "../IncomingCallDialog/IncomingCallDialog";
// import CallingRejectedDialog from "../CallingRejectedDialog/CallingRejectedDialog";
import CallingDialog from "../CallingDialog/CallingDialog";
import LocalVideoView from "../LocalVideoView/LocalVideoView";
import RemoteVideoView from "../RemoteVideoView/RemoteVideoView";
import { callStates } from "../../../store/actions/callActions";

const DirectCall = (props) => {
  const {
    localStream,
    remoteStream,
    callState,
    callerUsername,
    callingDialogVisible,
  } = props;
  console.log(callerUsername);
  return (
    <>
      <LocalVideoView localStream={localStream} />
      {remoteStream && <RemoteVideoView remoteStream={remoteStream} />}
      {callState === callStates.CALL_REQUESTED && <IncomingCallDialog callerUsername={callerUsername} />}
      {callingDialogVisible && <CallingDialog />}
    </>
  );
};

function mapStoreStateToProps({ call }) {
  return {
    ...call,
  };
}

export default connect(mapStoreStateToProps, null)(DirectCall);
