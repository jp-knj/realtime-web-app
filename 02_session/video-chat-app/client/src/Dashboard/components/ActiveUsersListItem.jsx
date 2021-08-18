import React from "react";
import { callToOtherUser } from "../../utils/webRTC/webRTCHandler";

const ActiveUsersListItem = (props) => {
  const { activeUser } = props;
  const handleListItemPressed = () => {
    callToOtherUser(activeUser);
  };

  console.log(activeUser);
  return <li onClick={handleListItemPressed}>{activeUser.username}</li>;
};
export default ActiveUsersListItem;
