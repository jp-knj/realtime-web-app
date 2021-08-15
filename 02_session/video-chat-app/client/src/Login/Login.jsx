import React from "react";
import { useHistory } from "react-router-dom";
import { connect } from "react-redux";

import UsernameInput from "./components/UsernameInput";
import SubmitButton from "./components/SubmitButton";

import { setUsername } from "../store/actions/dashboardActions";
import { registerNewUser } from "../utils/wssConnection/wssConnection";

const Login = ({ saveUsername }) => {
  const [username, setUsername] = React.useState("");
  const history = useHistory();

  const handleSubmitButtonPressed = () => {
    saveUsername(username);
    registerNewUser(username);
    history.push("/dashboard");
  };

  return (
    <div>
      <h2>Login</h2>
      <UsernameInput username={username} setUsername={setUsername} />
      <SubmitButton handleSubmitButtonPressed={handleSubmitButtonPressed} />
    </div>
  );
};

const mapActionsToProps = (dispatch) => {
  return {
    saveUsername: (username) => dispatch(setUsername(username)),
  };
};

export default connect(null, mapActionsToProps)(Login);
