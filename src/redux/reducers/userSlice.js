import { createSlice } from '@reduxjs/toolkit'

/**
 * @description - Reducer for Tenant's stages
 */

const initialState = {
  //just random user for now
  user: Math.random().toString(36).slice(2, 7),
}

const sliceConfig = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, { payload }) {
      state.user = payload
    },
  },
})

export const { setUser } = sliceConfig.actions
export default sliceConfig.reducer
