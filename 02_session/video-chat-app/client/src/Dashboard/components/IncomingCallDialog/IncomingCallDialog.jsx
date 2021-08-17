import React from "react";

const IncomigCallDialog = () => {
  const handleAcceptButtonPressed = () => {};
  const handleRejectedButtonPressed = () => {};

  return (
    <>
      <div>
        <span>Rejected</span>
        <button onClick={handleAcceptButtonPressed}>Accepted</button>
        <button onClick={handleRejectedButtonPressed}>Rejected</button>
      </div>
    </>
  );
};

export default IncomigCallDialog;
