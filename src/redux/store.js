import { applyMiddleware, combineReducers, createStore } from "redux";
import logger from "redux-logger";
import chatReducer from "./chat/chat.reducer";
import userReducer from "./user/user.reducer";

const rootReducer = combineReducers({
  user: userReducer,
  chat: chatReducer,
});

export const store = createStore(rootReducer, applyMiddleware(logger));
