import React from "react";
import ActiveUserListItem from "./ActiveUsersListItem";
import { connect } from "react-redux";

const ActiveUserList = ({ activeUsers }) => {
  return (
    <ul>
      {activeUsers.map((activeUser) => (
        <ActiveUserListItem key={activeUser.socketId} activeUser={activeUser} />
      ))}
    </ul>
  );
};

const mapStateToProps = ({ dashboard }) => ({
  ...dashboard,
});

export default connect(mapStateToProps)(ActiveUserList);
