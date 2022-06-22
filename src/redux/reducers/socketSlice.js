import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  //just random user for now
  socket: null,
  subscription: null
}

const sliceConfig = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocket(state, { payload }) {
      state.socket = payload
    },
    setSubscription(state, {payload}) {
      state.subscription = payload
    }
  },
})

export const { setSocket, setSubscription } = sliceConfig.actions
export default sliceConfig.reducer
