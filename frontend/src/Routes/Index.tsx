import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { ROUTES } from '@/Constants/routes'
import { detectLang } from '@/Locales'
import MainLayout from '@/Components/Layouts/MainLayout'
import AuthLayout from '@/Components/Layouts/AuthLayout'
import DashboardLayout from '@/Components/Layouts/DashboardLayout'
import Protected from './Protected'
import PublicOnly from './PublicOnly'

// Public pages
const Home = lazy(() => import('@/Pages/Public/Home'))
const Projects = lazy(() => import('@/Pages/Public/Projects'))
const ProjectDetail = lazy(() => import('@/Pages/Public/ProjectDetail'))
const Contact = lazy(() => import('@/Pages/Public/Contact'))
const NotFound = lazy(() => import('@/Pages/Common/NotFound'))

// Auth
const Login = lazy(() => import('@/Pages/Auth/Login'))

// Dashboard (code-split: not included in public bundle)
const Dashboard = lazy(() => import('@/Pages/Dashboard/Overview'))
const DashboardProjects = lazy(() => import('@/Pages/Dashboard/Projects'))
const DashboardSkills = lazy(() => import('@/Pages/Dashboard/Skills'))
const DashboardExperience = lazy(() => import('@/Pages/Dashboard/Experience'))
const DashboardInbox = lazy(() => import('@/Pages/Dashboard/Inbox'))
const DashboardProfile = lazy(() => import('@/Pages/Dashboard/Profile'))

export default function AppRoutes() {
  return (
    <Routes>
      {/* Root → redirect to detected language */}
      <Route path="/" element={<Navigate to={`/${detectLang()}`} replace />} />

      {/* Public — language-prefixed, wrapped in MainLayout */}
      <Route path="/:lang" element={<MainLayout />}>
        <Route
          index
          element={
            <Suspense>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="projects"
          element={
            <Suspense>
              <Projects />
            </Suspense>
          }
        />
        <Route
          path="projects/:slug"
          element={
            <Suspense>
              <ProjectDetail />
            </Suspense>
          }
        />
        <Route
          path="contact"
          element={
            <Suspense>
              <Contact />
            </Suspense>
          }
        />
        <Route
          path="*"
          element={
            <Suspense>
              <NotFound />
            </Suspense>
          }
        />
      </Route>

      {/* Auth — redirect if already logged in (not language-prefixed) */}
      <Route element={<PublicOnly />}>
        <Route element={<AuthLayout />}>
          <Route
            path={ROUTES.LOGIN}
            element={
              <Suspense>
                <Login />
              </Suspense>
            }
          />
        </Route>
      </Route>

      {/* Dashboard — requires auth (admin, single language) */}
      <Route element={<Protected />}>
        <Route element={<DashboardLayout />}>
          <Route
            path={ROUTES.DASHBOARD}
            element={
              <Suspense>
                <Dashboard />
              </Suspense>
            }
          />
          <Route
            path={ROUTES.DASHBOARD_PROJECTS}
            element={
              <Suspense>
                <DashboardProjects />
              </Suspense>
            }
          />
          <Route
            path={ROUTES.DASHBOARD_SKILLS}
            element={
              <Suspense>
                <DashboardSkills />
              </Suspense>
            }
          />
          <Route
            path={ROUTES.DASHBOARD_EXPERIENCE}
            element={
              <Suspense>
                <DashboardExperience />
              </Suspense>
            }
          />
          <Route
            path={ROUTES.DASHBOARD_INBOX}
            element={
              <Suspense>
                <DashboardInbox />
              </Suspense>
            }
          />
          <Route
            path={ROUTES.DASHBOARD_PROFILE}
            element={
              <Suspense>
                <DashboardProfile />
              </Suspense>
            }
          />
        </Route>
      </Route>
    </Routes>
  )
}
