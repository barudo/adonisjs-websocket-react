import { createSlice } from '@reduxjs/toolkit'

/**
 * @description - Reducer for Tenant's stages
 */

const initialState = {
  messages: {},
  currentQuestion: {},
}

const sliceConfig = createSlice({
  name: 'message',
  initialState,
  reducers: {
    appendMessage(state, { payload }) {
      if (state.messages[payload.topic]) {
        state.messages[payload.topic] = [...state.messages[payload.topic], payload.message]
      } else {
        state.messages = { ...state.messages, [payload.topic]: [payload.message] }
      }
    },
    setCurrentQuestion(state, { payload }) {
      state.currentQuestion = payload
    },
    emptyTopicMessages(state, { payload }) {
      if (state.messages[payload.topic]) {
        state.messages[payload.topic] = []
      } else {
        state.messages = { ...state.messages, [payload.topic]: [] }
      }
    },
  },
})

export const { appendMessage, setCurrentQuestion, emptyTopicMessages } = sliceConfig.actions
export default sliceConfig.reducer
