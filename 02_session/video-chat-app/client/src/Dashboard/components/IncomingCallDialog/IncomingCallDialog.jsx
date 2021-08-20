import React from "react";

const IncomingCallDialog = ({
  callerUsername,
  acceptIncomingCallRequest,
  rejectedIncomingCallRequest,
}) => {
  const handleAcceptButtonPressed = () => {
    acceptIncomingCallRequest();
  };
  const handleRejectedButtonPressed = () => {
    rejectedIncomingCallRequest();
  };

  return (
    <>
      <div>
        <span>{callerUsername}</span>
        <button onClick={handleAcceptButtonPressed}>Accepted</button>
        <button onClick={handleRejectedButtonPressed}>Rejected</button>
      </div>
    </>
  );
};

export default IncomingCallDialog;
