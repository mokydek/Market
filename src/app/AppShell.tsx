import { Suspense } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { useAuth } from '@/shared/auth/AuthProvider'
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher'
import { Spinner } from '@/shared/components/Spinner'

// Layout for everything under /app: a persistent, auth aware header plus the
// nested route content rendered through Outlet.
export default function AppShell() {
  const { t } = useI18n()
  const { user, signOut } = useAuth()

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="flex items-center justify-between border-b border-line px-4 py-4 sm:px-6">
        <Link
          to="/app"
          className="font-display text-lg font-semibold tracking-tight"
        >
          {t('appName')}
        </Link>
        <div className="flex items-center gap-4 sm:gap-6">
          <LanguageSwitcher />
          {user ? (
            <>
              <Link
                to="/app/favorites"
                className="hidden text-sm text-ink/60 transition-colors hover:text-ink sm:inline"
              >
                {t('favorites')}
              </Link>
              <Link
                to="/app/history"
                className="hidden text-sm text-ink/60 transition-colors hover:text-ink sm:inline"
              >
                {t('history')}
              </Link>
              <Link
                to="/app/profile"
                className="text-sm text-ink/60 transition-colors hover:text-ink"
              >
                {t('profile')}
              </Link>
              <button
                type="button"
                onClick={() => void signOut()}
                className="text-sm text-ink/60 transition-colors hover:text-ink"
              >
                {t('signOut')}
              </button>
            </>
          ) : (
            <Link
              to="/app/sign-in"
              className="text-sm text-ink/60 transition-colors hover:text-ink"
            >
              {t('signIn')}
            </Link>
          )}
        </div>
      </header>

      <main className="flex-1">
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
              <Spinner size={24} />
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  )
}
