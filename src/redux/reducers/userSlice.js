import { createSlice } from '@reduxjs/toolkit'

/**
 * @description - Reducer for Tenant's stages
 */

const initialState = {
  //just random user for now
  user: Math.random().toString(36).slice(2, 7),
  jwtToken: ''
}

const sliceConfig = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, { payload }) {
      state.user = payload
    },
    setToken(state, {payload}) {
      state.jwtToken = payload
    }
  },
})

export const { setUser, setToken } = sliceConfig.actions
export default sliceConfig.reducer
