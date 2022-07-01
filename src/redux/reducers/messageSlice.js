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
      if (state.currentQuestion[payload.topic]) {
        state.currentQuestion[payload.topic] = payload.question
      } else {
        state.currentQuestion = { ...state.currentQuestion, [payload.topic]: payload.question }
      }
    },
    emptyTopicMessages(state, { payload }) {
      if (state.messages[payload.topic]) {
        state.messages[payload.topic] = []
      } else {
        state.messages = { ...state.messages, [payload.topic]: [] }
      }
    },
    emptyCurrentQuestion(state, { payload }) {
      if (state.currentQuestion[payload.topic]) {
        state.currentQuestion[payload.topic] = null
      } else {
        state.currentQuestion = { ...state.currentQuestion, [payload.topic]: null }
      }
    },
  },
})

export const { appendMessage, setCurrentQuestion, emptyTopicMessages, emptyCurrentQuestion } =
  sliceConfig.actions
export default sliceConfig.reducer
