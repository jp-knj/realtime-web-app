import Item from "../Item";

const ActiveUsers = [
  {
    socketId: 11,
    username: "kenji",
  },
  {
    socketId: 22,
    username: "kenta",
  },
  {
    socketId: 33,
    username: "kenzou",
  },
];
const List = () => {
  return (
    <ul>
      {ActiveUsers.map((activeUser) => (
        <Item key={activeUser.socketId} activeUser={activeUser} />
      ))}
    </ul>
  );
};

export default List;
