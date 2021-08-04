import SocketsProvider from "../context/SocketContext";
function App({ Component, pageProps }) {
  return (
    <SocketsProvider>
      <Component {...pageProps} />
    </SocketsProvider>
  );
}

export default App;
