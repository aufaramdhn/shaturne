import { createContext, useContext, useEffect } from 'react'
import type { ReactNode } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleTheme } from '@/Redux/Features/UiSlice'
import type { RootState } from '@/Redux/Store'

interface ThemeContextValue {
  theme: 'dark' | 'light'
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch()
  const theme = useSelector((state: RootState) => state.ui.theme)

  // Sync data-theme attribute on <html> so CSS custom properties apply
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  return (
    <ThemeContext.Provider value={{ theme, toggle: () => dispatch(toggleTheme()) }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext)
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider')
  return ctx
}
