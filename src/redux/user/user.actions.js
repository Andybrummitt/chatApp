export const logInUser = (payload) => ({
  type: "LOG_IN_USER",
  payload,
});

export const logOutUser = (payload) => ({
  type: "LOG_OUT_USER",
  payload,
});

export const updateUserName = (payload) => ({
  type: "UPDATE_USER_NAME",
  payload,
});
