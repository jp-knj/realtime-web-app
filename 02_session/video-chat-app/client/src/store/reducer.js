import { combineReducers } from "redux";
import dashboardReducers from "./reducers/dashboardReducers";
import callReducer from "./reducers/callReducer";

export default combineReducers({
  dashboard: dashboardReducers,
  call: callReducer,
});
