import {Action, ThunkAction, configureStore } from "@reduxjs/toolkit"
import authReducer from "../features/auth/authSlice"
import { listenerMiddleware } from "./listenerMiddleware"
import { apiSlice } from "../features/api/apiSlice"
const store = configureStore({
  reducer: {
    auth: authReducer,
    [apiSlice.reducerPath]: apiSlice.reducer
  },

  middleware: getDefaultMiddleware => 
    getDefaultMiddleware()
    .prepend(listenerMiddleware.middleware)
    .concat(apiSlice.middleware)
})

export default store;
export type AppStore = typeof store
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk = ThunkAction<void, RootState, unknown, Action>

