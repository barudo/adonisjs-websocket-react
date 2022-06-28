import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  error: '',
}

const sliceConfig = createSlice({
  name: 'error',
  initialState,
  reducers: {
    setError(state, { payload }) {
      state.error = payload
    },
  },
})

export const { setError } = sliceConfig.actions
export default sliceConfig.reducer
