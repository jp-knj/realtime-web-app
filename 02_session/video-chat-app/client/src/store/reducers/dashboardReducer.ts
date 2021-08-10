import * as dashboardAction from "../actions/dashboardAction";

type State = {
  username: string;
};

const initState: State = {
  username: "",
};

const reducer = (state = initState, action: any) => {
  switch (action.type) {
    case dashboardAction.DASHBOARD_SET_USERNAME:
      return {
        ...state,
        username: action.username,
      };
    default:
      return state;
  }
};

export default reducer;
