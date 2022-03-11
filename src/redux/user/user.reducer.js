const INITIAL_STATE = {
  user: null,
  username: "",
};

function userReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "LOG_IN_USER":
      return {
        ...state,
        user: action.payload,
      };
    case "LOG_OUT_USER":
      return {
        ...state,
        user: null,
        username: "",
      };
    case "UPDATE_USER_NAME":
      return {
        ...state,
        username: action.payload,
      };
    default:
      return state;
  }
}

export default userReducer;
