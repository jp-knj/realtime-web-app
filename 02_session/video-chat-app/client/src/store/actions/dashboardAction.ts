export const DASHBOARD_SET_USERNAME = "DASHBOARD_SET_USERNAME" as const;

export const setUsername = (username: string) => {
  return {
    type: DASHBOARD_SET_USERNAME,
    username,
  };
};
