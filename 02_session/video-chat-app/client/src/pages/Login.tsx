import React, { useState } from "react";
import { connect } from "react-redux";
import { useHistory } from "react-router-dom";
import Input from "../components/Input";
import Button from "../components/Button";
import { setUsername } from "../store/actions/dashboardAction";

type Props = {
  saveUsername: any;
};

const Login: React.FC<Props> = ({ saveUsername }) => {
  const history = useHistory();
  const [username, setUsername] = useState<string>("");
  const handleSubmit = () => {
    history.push("/dashboard");
    saveUsername(username);
  };
  return (
    <>
      <h2>ダッシュボードへ</h2>
      <Input username={username} setUsername={setUsername} />
      <Button handleSubmit={handleSubmit} />
    </>
  );
};
const mapActionsToProps = (dispatch: any) => {
  return {
    saveUsername: (username: string) => dispatch(setUsername(username)),
  };
};
export default connect(null, mapActionsToProps)(Login);
