import React from "react";
import * as webRTCHandler from "../utils/webRTC/webRTCHandler";

import ActiveUsersList from "./components/ActiveUsersList";
import DirectCall from "./components/DirectCall/DirectCall";

const Dashboard = () => {
  React.useEffect(() => {
    webRTCHandler.getLocalStream();
  });
  return (
    <div>
      <h2>Dashboard</h2>
      <DirectCall />
      <ActiveUsersList />
    </div>
  );
};

export default Dashboard;
