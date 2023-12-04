import { configureStore } from '@reduxjs/toolkit'
import dfaReducer from './dfaReducer'

export const store = configureStore({
  reducer: {
    dfa: dfaReducer
  },
})