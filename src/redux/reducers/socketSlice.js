import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  //just random user for now
  socket: null,
  subscriptions: {},
  topics: [],
  activeTopic: null,
}

const sliceConfig = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket(state, { payload }) {
      state.socket = payload
    },
    addSubscription(state, { payload }) {
      state.subscriptions = { ...state.subscriptions, [payload.topic]: payload.subscription }
      state.topics = [...state.topics, payload.topic]
    },
    setActiveTopic(state, { payload }) {
      state.activeTopic = payload
    },
  },
})

export const { setSocket, addSubscription, setActiveTopic } = sliceConfig.actions
export default sliceConfig.reducer
