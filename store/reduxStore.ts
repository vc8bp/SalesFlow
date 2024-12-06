import { configureStore } from '@reduxjs/toolkit'
import counterSlice from './Cart'

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: counterSlice
    },
  })
}

export type AppStore = ReturnType<typeof makeStore>
export type RootState = ReturnType<AppStore['getState']>
export type AppDispatch = AppStore['dispatch']