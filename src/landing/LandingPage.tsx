import { useI18n } from '@/shared/i18n/I18nProvider'
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher'

export default function LandingPage() {
  const { t } = useI18n()

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-paper px-6 text-center text-ink">
      <div className="absolute right-6 top-6">
        <LanguageSwitcher />
      </div>

      <h1 className="font-display text-5xl font-semibold tracking-tight">
        {t('appName')}
      </h1>
      <p className="mt-4 text-lg text-ink/70">{t('tagline')}</p>
      <p className="mt-2 text-sm text-ink/40">{t('landingNote')}</p>
    </div>
  )
}
