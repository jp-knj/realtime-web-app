import React from "react";

const SubmitButton = ({ handleSubmitButtonPressed }) => {
  return (
    <div>
      <button onClick={handleSubmitButtonPressed}>はじめる</button>
    </div>
  );
};
export default SubmitButton;
