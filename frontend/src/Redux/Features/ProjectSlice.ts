import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

export interface Project {
  uuid: string
  title: string
  slug: string
  description: string
  stack: string[]
  repo_url: string | null
  demo_url: string | null
  is_published: boolean
  images: { path: string; url: string; order: number }[]
}

interface ProjectState {
  list: Project[]
  detail: Project | null
  isLoading: boolean
  error: string | null
}

const initialState: ProjectState = {
  list: [],
  detail: null,
  isLoading: false,
  error: null,
}

const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    setProjects(state, action: PayloadAction<Project[]>) {
      state.list = action.payload
      state.isLoading = false
      state.error = null
    },
    setDetail(state, action: PayloadAction<Project>) {
      state.detail = action.payload
      state.isLoading = false
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload
    },
    setError(state, action: PayloadAction<string>) {
      state.error = action.payload
      state.isLoading = false
    },
    clearDetail(state) {
      state.detail = null
    },
  },
})

export const { setProjects, setDetail, setLoading, setError, clearDetail } = projectSlice.actions
export default projectSlice.reducer
