import thunk from 'redux-thunk'
import { combineReducers, configureStore } from '@reduxjs/toolkit'
import messageReducer from './reducers/messageSlice'

const middleware = [thunk]

const store = configureStore({
  reducer: combineReducers({
    messages: messageReducer,
  }),
  middleware: middleware,
})

export default store
