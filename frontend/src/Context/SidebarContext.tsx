import { createContext, useContext } from 'react'
import type { ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSidebar, setSidebar } from '@/Redux/Features/UiSlice'
import type { RootState } from '@/Redux/Store'

interface SidebarContextValue {
  isOpen: boolean
  toggle: () => void
  close: () => void
}

const SidebarContext = createContext<SidebarContextValue | null>(null)

export function SidebarProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch()
  const isOpen = useSelector((state: RootState) => state.ui.sidebarOpen)

  return (
    <SidebarContext.Provider
      value={{
        isOpen,
        toggle: () => dispatch(toggleSidebar()),
        close: () => dispatch(setSidebar(false)),
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar(): SidebarContextValue {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider')
  return ctx
}
