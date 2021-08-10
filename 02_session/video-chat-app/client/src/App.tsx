import React, { useEffect } from "react";
import { connectWithWebSocket } from "./utils/wsConnection";

function App() {
  useEffect(() => {
    connectWithWebSocket();
  });
  return <div>Hello React</div>;
}

export default App;
