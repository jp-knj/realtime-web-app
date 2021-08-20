import React from "react";
import { connect } from "react-redux";
import IncomingCallDialog from "../IncomingCallDialog/IncomingCallDialog";
import CallingRejectedDialog from "../CallingRejectedDialog/CallingRejectedDialog";
import CallingDialog from "../CallingDialog/CallingDialog";
import LocalVideoView from "../LocalVideoView/LocalVideoView";
import RemoteVideoView from "../RemoteVideoView/RemoteVideoView";
import {
  callStates,
  setCallRejected,
} from "../../../store/actions/callActions";

const DirectCall = (props) => {
  const {
    localStream,
    remoteStream,
    callState,
    callerUsername,
    callingDialogVisible,
    callRejected,
    hideCallRejectedDialog,
  } = props;
  return (
    <>
      <LocalVideoView localStream={localStream} />
      {remoteStream && <RemoteVideoView remoteStream={remoteStream} />}
      {callRejected.rejected && (
        <CallingRejectedDialog
          reason={callRejected.reason}
          hideCallRejectedDialog={hideCallRejectedDialog}
        />
      )}
      {callState === callStates.CALL_REQUESTED && (
        <IncomingCallDialog callerUsername={callerUsername} />
      )}
      {callingDialogVisible && <CallingDialog />}
    </>
  );
};

function mapStoreStateToProps({ call }) {
  return {
    ...call,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    hideCallRejectedDialog: (callRejectedDetails) => {
      dispatch(setCallRejected(callRejectedDetails));
    },
  };
}

export default connect(mapStoreStateToProps, mapDispatchToProps)(DirectCall);
