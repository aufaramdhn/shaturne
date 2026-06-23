import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

type Theme = 'dark' | 'light'

interface Toast {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
}

interface UiState {
  theme: Theme
  sidebarOpen: boolean
  toasts: Toast[]
}

const storedTheme = localStorage.getItem('theme') as Theme | null
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches

const initialState: UiState = {
  theme: storedTheme ?? (prefersDark ? 'dark' : 'light'),
  sidebarOpen: false,
  toasts: [],
}

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    toggleTheme(state) {
      state.theme = state.theme === 'dark' ? 'light' : 'dark'
      localStorage.setItem('theme', state.theme)
    },
    setTheme(state, action: PayloadAction<Theme>) {
      state.theme = action.payload
      localStorage.setItem('theme', action.payload)
    },
    toggleSidebar(state) {
      state.sidebarOpen = !state.sidebarOpen
    },
    setSidebar(state, action: PayloadAction<boolean>) {
      state.sidebarOpen = action.payload
    },
    addToast(state, action: PayloadAction<Omit<Toast, 'id'>>) {
      state.toasts.push({ ...action.payload, id: crypto.randomUUID() })
    },
    removeToast(state, action: PayloadAction<string>) {
      state.toasts = state.toasts.filter(t => t.id !== action.payload)
    },
  },
})

export const { toggleTheme, setTheme, toggleSidebar, setSidebar, addToast, removeToast } =
  uiSlice.actions
export default uiSlice.reducer
