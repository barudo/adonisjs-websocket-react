import thunk from 'redux-thunk'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import messageReducer from './reducers/messageSlice'
import userReducer from './reducers/userSlice'
import socketReducer from './reducers/socketSlice'
import errorReducer from './reducers/errorSlice'
import serverReducer from './reducers/serverSlice'

const middleware = [thunk]

const store = configureStore({
  reducer: combineReducers({
    messages: messageReducer,
    user: userReducer,
    socket: socketReducer,
    error: errorReducer,
    server: serverReducer,
  }),
  middleware: middleware,
})

export default store
