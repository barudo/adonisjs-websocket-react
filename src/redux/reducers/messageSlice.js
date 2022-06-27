import { createSlice } from '@reduxjs/toolkit'

/**
 * @description - Reducer for Tenant's stages
 */

const initialState = {
  messages: {},
}

const sliceConfig = createSlice({
  name: 'message',
  initialState,
  reducers: {
    appendMessage(state, { payload }) {
      if(state.messages[payload.topic]) {
        state.messages[payload.topic] = [...state.messages[payload.topic], payload.message]
      } else {
        state.messages = {...state.messages, [payload.topic]: [payload.message]}
      }
    },
  },
})

export const { appendMessage } = sliceConfig.actions
export default sliceConfig.reducer
