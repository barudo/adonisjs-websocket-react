import { createSlice } from '@reduxjs/toolkit'
import socket from '../../utils/socket'

/**
 * @description - Reducer for Tenant's stages
 */

const initialState = {
  //just random user for now
  socket: socket.connect(),
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
