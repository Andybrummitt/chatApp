const INITIAL_STATE = {
  otherUser: {
    username: null,
    uid: null,
  },
  chatOpen: false,
};

function chatReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "OPEN_CHAT_WINDOW":
      return {
        ...state,
        chatOpen: true,
        otherUser: action.payload,
      };
    case "CLOSE_CHAT_WINDOW":
      return {
        ...state,
        chatOpen: false,
        otherUser: {
          username: null,
          uid: null,
        },
      };
    default:
      return state;
  }
}

export default chatReducer;
