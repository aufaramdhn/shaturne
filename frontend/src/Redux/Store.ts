import { configureStore } from '@reduxjs/toolkit'
import authReducer from './Features/AuthSlice'
import uiReducer from './Features/UiSlice'
import projectReducer from './Features/ProjectSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    project: projectReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
