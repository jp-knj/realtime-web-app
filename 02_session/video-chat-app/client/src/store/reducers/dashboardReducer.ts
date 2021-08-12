import * as dashboardAction from "../actions/dashboardAction";

type State = {
  username: string;
  activeUsers: [];
};

const initState: State = {
  username: "",
  activeUsers: [],
};

const reducer = (state = initState, action: any) => {
  switch (action.type) {
    case dashboardAction.DASHBOARD_SET_USERNAME:
      return {
        ...state,
        username: action.username,
      };
    case dashboardAction.DASHBOARD_SET_ACTIVE_USERS:
      return {
        ...state,
        activeUsers: action.activeUsers,
      };
    default:
      return state;
  }
};

export default reducer;
