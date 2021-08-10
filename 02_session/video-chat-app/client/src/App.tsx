import React from "react";
import Routers from "./routers";
import { connectWithWebSocket } from "./utils/wsConnection";

function App() {
  React.useEffect(() => {
    connectWithWebSocket();
  }, []);
  return <Routers />;
}

export default App;
