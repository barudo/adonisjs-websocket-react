import thunk from 'redux-thunk'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import messageReducer from './reducers/messageSlice'
import userReducer from './reducers/userSlice'

const middleware = [thunk]

const store = configureStore({
  reducer: combineReducers({
    messages: messageReducer,
    user: userReducer
  }),
  middleware: middleware,
})

export default store
