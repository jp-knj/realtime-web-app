const Item = (props: any) => {
  const { activeUser } = props;
  return (
    <li>
      <div>
        <span>{activeUser.username}</span>
      </div>
    </li>
  );
};
export default Item;
