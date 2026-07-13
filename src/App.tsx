import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ScrollToTop } from '@/shared/components/ScrollToTop'
import { Spinner } from '@/shared/components/Spinner'
import { ProtectedRoute } from '@/shared/auth/ProtectedRoute'

const LandingPage = lazy(() => import('@/landing/LandingPage'))
const AppShell = lazy(() => import('@/app/AppShell'))
const AppHome = lazy(() => import('@/app/AppHome'))
const SignIn = lazy(() => import('@/app/SignIn'))
const SignUp = lazy(() => import('@/app/SignUp'))
const Profile = lazy(() => import('@/app/Profile'))
const History = lazy(() => import('@/app/History'))
const Favorites = lazy(() => import('@/app/Favorites'))
const NotFound = lazy(() => import('@/app/NotFound'))

function RouteFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper">
      <Spinner size={24} />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<AppShell />}>
            <Route index element={<AppHome />} />
            <Route path="sign-in" element={<SignIn />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
            />
            <Route
              path="history"
              element={
                <ProtectedRoute>
                  <History />
                </ProtectedRoute>
              }
            />
            <Route
              path="favorites"
              element={
                <ProtectedRoute>
                  <Favorites />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
