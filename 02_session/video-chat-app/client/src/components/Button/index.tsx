const Button = (props: any) => {
  const { handleSubmit } = props;
  return <button onClick={handleSubmit}>ビデオチャットをはじめる</button>;
};
export default Button;
