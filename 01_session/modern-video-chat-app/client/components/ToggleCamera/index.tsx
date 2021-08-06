import React from "react";

type Props = {
  mute: boolean;
  setter: Function;
};

const ToggleCamera: React.FC<Props> = ({ mute, setter }) => {
  const handleOnClick = () => {
    setter(!mute);
  };
  return <button onClick={handleOnClick}>カメラ</button>;
};

export default ToggleCamera;
