import { createSlice } from '@reduxjs/toolkit'

/**
 * @description - Reducer for Tenant's stages
 */

const initialState = {
  messages: [],
}

const sliceConfig = createSlice({
  name: 'message',
  initialState,
  reducers: {
    appendMessage(state, { payload }) {
      state.messages = [...state.messages, payload]
    },
  },
})

export const { appendMessage } = sliceConfig.actions
export default sliceConfig.reducer
