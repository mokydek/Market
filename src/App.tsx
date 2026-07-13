import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { ScrollToTop } from '@/shared/components/ScrollToTop'

const LandingPage = lazy(() => import('@/landing/LandingPage'))
const AppShell = lazy(() => import('@/app/AppShell'))

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/app" element={<AppShell />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  )
}
