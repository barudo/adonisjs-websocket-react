import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  socket: null,
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
    addTopic(state, { payload }) {
      state.topics = [...state.topics, payload]
    },
    removeTopic(state, { payload }) {
      const validTopics = state.topics.filter((topic) => topic !== payload)
      state.topics = validTopics
    },
    setActiveTopic(state, { payload }) {
      state.activeTopic = payload
    },
  },
})

export const { setSocket, addTopic, removeTopic, setActiveTopic } = sliceConfig.actions
export default sliceConfig.reducer
