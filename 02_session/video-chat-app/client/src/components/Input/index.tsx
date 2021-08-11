import React from "react";

type Props = {
  username: string;
  setUsername: any;
};

const Input: React.FC<Props> = (props) => {
  const { username, setUsername } = props;
  return (
    <>
      <input
        placeholder="なまえをいれてね"
        type="text"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
        }}
      />
    </>
  );
};

export default Input;
