const INITIAL_STATE = {
  user: null,
  hasUniqueUsername: true,
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
        hasUniqueUsername: true,
      };
    case "SET_HAS_UNIQUE_USERNAME":
      return {
        ...state,
        hasUniqueUsername: action.payload,
      };
    default:
      return state;
  }
}

export default userReducer;
