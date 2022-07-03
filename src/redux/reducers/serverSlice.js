import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  server: 'http://localhost:3000',
}

const sliceConfig = createSlice({
  name: 'server',
  initialState,
  reducers: {
    setServer(state, { payload }) {
      state.server = payload
    },
  },
})

export const { setServer } = sliceConfig.actions
export default sliceConfig.reducer
