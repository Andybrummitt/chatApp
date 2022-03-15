import { applyMiddleware, createStore } from 'redux';
import userReducer from './user/user.reducer'
import logger from 'redux-logger'



export const store = createStore(userReducer, applyMiddleware(logger));


// Logger with default options