import { connect } from "react-redux";
import Item from "../Item";

const List = (activeUsers: any) => {
  return (
    <ul>
      {activeUsers.map((activeUser: any) => (
        <Item key={activeUser.socketId} activeUser={activeUser} />
      ))}
    </ul>
  );
};
const mapStateToProps = (dashboard: any) => ({
  ...dashboard,
});

export default connect(mapStateToProps)(List);
