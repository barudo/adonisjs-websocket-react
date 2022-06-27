import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  //just random user for now
  socket: null,
  subscriptions: {},
  topics: []
}

const sliceConfig = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket(state, { payload }) {
      state.socket = payload
    },
    addSubscription(state, {payload}) {
      state.subscriptions = {...state.subscriptions, [payload.topic]: payload.subscription}
      state.topics = [...state.topics, payload.topic]
    }
  },
})

export const { setSocket, addSubscription } = sliceConfig.actions
export default sliceConfig.reducer
