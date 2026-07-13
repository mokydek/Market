import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ScrollToTop } from '@/shared/components/ScrollToTop'
import { Spinner } from '@/shared/components/Spinner'

const LandingPage = lazy(() => import('@/landing/LandingPage'))
const AppShell = lazy(() => import('@/app/AppShell'))

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
          <Route path="/app" element={<AppShell />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
