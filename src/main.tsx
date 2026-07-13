import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fontsource-variable/rubik'
import '@fontsource-variable/inter'
import './index.css'
import App from './App.tsx'
import { I18nProvider } from '@/shared/i18n/I18nProvider'
import { AuthProvider } from '@/shared/auth/AuthProvider'
import { FavoritesProvider } from '@/shared/favorites/FavoritesProvider'
import { ErrorBoundary } from '@/shared/components/ErrorBoundary'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <I18nProvider>
      <ErrorBoundary>
        <AuthProvider>
          <FavoritesProvider>
            <App />
          </FavoritesProvider>
        </AuthProvider>
      </ErrorBoundary>
    </I18nProvider>
  </StrictMode>,
)
