import React from "react";

const CallingRejectedDialog = ({ reason, hideCallRejectedDialog }) => {
  React.useEffect(() => {
    setTimeout(() => {
      hideCallRejectedDialog({
        rejected: false,
        reason: "",
      });
    });
  }, [4000]);

  return (
    <>
      <span>{reason}</span>
    </>
  );
};

export default CallingRejectedDialog;
