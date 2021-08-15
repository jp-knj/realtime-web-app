import React from "react";

const ActiveUsersListItem = (props) => {
  const { activeUser } = props;
  const handleListItemPressed = () => {};
  return <li onClick={handleListItemPressed}>{activeUser.username}</li>;
};
export default ActiveUsersListItem;
