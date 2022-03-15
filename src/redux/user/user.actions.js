export const logInUser = (payload) => ({
  type: "LOG_IN_USER",
  payload,
});

export const logOutUser = (payload) => ({
  type: "LOG_OUT_USER",
  payload,
});

export const setHasUniqueUsername = (payload) => ({
  type: "SET_HAS_UNIQUE_USERNAME",
  payload,
});
