import React from "react";

type Props = {
  mute: boolean;
  setter: Function;
};

const ToggleMic: React.FC<Props> = ({ mute, setter }) => {
  let icon;
  if (mute) {
    icon = "Off";
  } else {
    icon = "On";
  }
  const handleOnClick = () => {
    setter(!mute);
  };
  return <button onClick={handleOnClick}>マイク:{icon}</button>;
};
export default ToggleMic;
