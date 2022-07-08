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
    prependMessage(state, { payload }) {
      if (state.messages[payload.topic]) {
        state.messages[payload.topic] = [payload.message, ...state.messages[payload.topic]]
      } else {
        state.messages = { ...state.messages, [payload.topic]: [payload.message] }
      }
    },
    updateMessage(state, { payload }) {
      state.messages[payload.topic] = state.messages[payload.topic].reduce((messages, message) => {
        if (message.id === payload.id) {
          message.message = `${payload.message}(edited)`
          message.attachments = payload.attachments
        }
        messages = [...messages, message]
        return messages
      }, [])
    },
    removeMessage(state, { payload }) {
      state.messages[payload.topic] = state.messages[payload.topic].reduce((messages, message) => {
        if (message.id === payload.id) {
          message.message = '(message removed)'
          message.attachments = ''
        }
        messages = [...messages, message]
        return messages
      }, [])
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

export const {
  appendMessage,
  emptyTopicMessages,
  emptyCurrentQuestion,
  prependMessage,
  removeMessage,
  setCurrentQuestion,
  updateMessage,
} = sliceConfig.actions
export default sliceConfig.reducer
