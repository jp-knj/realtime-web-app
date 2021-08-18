import React from "react";

const IncomingCallDialog = ({ callerUsername }) => {
  const handleAcceptButtonPressed = () => {};
  const handleRejectedButtonPressed = () => {};

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
