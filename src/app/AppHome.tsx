import { useI18n } from '@/shared/i18n/I18nProvider'

// Placeholder for the main app view. The search experience lands here in Phase 6.
export default function AppHome() {
  const { t } = useI18n()
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
      <h1 className="font-display text-3xl font-semibold tracking-tight">
        {t('appTitle')}
      </h1>
      <p className="mt-4 text-sm text-ink/50">{t('appNote')}</p>
    </div>
  )
}
