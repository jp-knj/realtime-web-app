import React, { useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import Dashboard from "./Dashboard/Dashboard";
import Login from "./Login/Login";
import { connectWithWebSocket } from "./utils/wssConnection/wssConnection";

function App() {
  useEffect(() => {
    connectWithWebSocket();
  }, []);

  return (
    <Router>
      <Switch>
        <Route path="/dashboard">
          <Dashboard />
        </Route>
        <Route path="/">
          <Login />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
