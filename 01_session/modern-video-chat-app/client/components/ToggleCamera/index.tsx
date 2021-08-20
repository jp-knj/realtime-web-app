import React from "react";

type Props = {
  mute: boolean;
  setter: Function;
};

const ToggleCamera: React.FC<Props> = ({ mute, setter }) => {
  let icon;
  if (mute) {
    icon = "Off";
  } else {
    icon = "On";
  }
  const handleOnClick = () => {
    setter(!mute);
  };
  return <button onClick={handleOnClick}>カメラ:{icon}</button>;
};

export default ToggleCamera;
