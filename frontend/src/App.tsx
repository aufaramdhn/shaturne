import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { MotionConfig } from 'framer-motion'
import { store } from '@/Redux/Store'
import { ThemeProvider } from '@/Context/ThemeContext'
import { SidebarProvider } from '@/Context/SidebarContext'
import Preloader from '@/Components/Fragments/UI/Preloader'
import AuthBootstrap from '@/Components/Fragments/Auth/AuthBootstrap'
import AppRoutes from '@/Routes/Index'

export default function App() {
  return (
    <Provider store={store}>
      {/* reducedMotion="never" — keputusan user: semua animasi selalu jalan,
          abaikan preferensi OS. Membuat semua useReducedMotion() return false. */}
      <MotionConfig reducedMotion="never">
        <ThemeProvider>
          <Preloader />
          <AuthBootstrap />
          <SidebarProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </SidebarProvider>
        </ThemeProvider>
      </MotionConfig>
    </Provider>
  )
}
