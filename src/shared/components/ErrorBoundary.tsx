import { Component, type ErrorInfo, type ReactNode } from 'react'
import { useI18n } from '@/shared/i18n/I18nProvider'

function ErrorFallback() {
  const { t } = useI18n()
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper px-6 text-center">
      <p className="max-w-sm text-sm text-ink/60">{t('errorGeneric')}</p>
    </div>
  )
}

type Props = { children: ReactNode }
type State = { hasError: boolean }

// Top level boundary. Rendered inside I18nProvider so the fallback can localize.
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback />
    }
    return this.props.children
  }
}
