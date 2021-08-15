import React from "react";
import ActiveUserListItem from "./ActiveUsersListItem";

const activeUsers = [
  { socketId: 321, username: "kenji" },
  {
    socketId: 333,
    username: "kenzou",
  },
  {
    socketId: 345,
    username: "kensirou",
  },
];
const ActiveUserList = () => {
  return (
    <ul>
      {activeUsers.map((activeUser) => (
        <ActiveUserListItem key={activeUser.socketId} activeUser={activeUser} />
      ))}
    </ul>
  );
};
export default ActiveUserList;
