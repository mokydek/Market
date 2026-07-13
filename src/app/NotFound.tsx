import { Link } from 'react-router-dom'
import { useI18n } from '@/shared/i18n/I18nProvider'

export default function NotFound() {
  const { t } = useI18n()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-paper px-6 text-center text-ink">
      <p className="font-display text-2xl font-semibold tracking-tight">
        {t('notFound')}
      </p>
      <Link
        to="/"
        className="text-sm text-ink/60 underline underline-offset-4 transition-colors hover:text-ink"
      >
        {t('appName')}
      </Link>
    </div>
  )
}
