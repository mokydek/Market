import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '@/shared/auth/AuthProvider'
import { Spinner } from '@/shared/components/Spinner'

// Redirects unauthenticated users to the sign in page. While the session is
// still loading it shows a spinner instead of redirecting prematurely.
export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size={24} />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/app/sign-in" replace />
  }

  return <>{children}</>
}
