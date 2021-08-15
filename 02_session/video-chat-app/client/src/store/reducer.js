import { combineReducers } from "redux";
import dashboardReducers from "./reducers/dashboardReducers";

export default combineReducers({
  dashboard: dashboardReducers,
});
