import { Link } from 'react-router-dom'
import { Search, ScanLine, TrendingUp } from 'lucide-react'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { LanguageSwitcher } from '@/shared/components/LanguageSwitcher'

export default function LandingPage() {
  const { t } = useI18n()

  const features = [
    { icon: Search, title: t('feature1Title'), text: t('feature1Text') },
    { icon: ScanLine, title: t('feature2Title'), text: t('feature2Text') },
    { icon: TrendingUp, title: t('feature3Title'), text: t('feature3Text') },
  ]

  return (
    <div className="flex min-h-screen flex-col bg-paper text-ink">
      <header className="flex items-center justify-between border-b border-line px-4 py-4 sm:px-6">
        <span className="font-display text-lg font-semibold tracking-tight">
          {t('appName')}
        </span>
        <div className="flex items-center gap-4 sm:gap-6">
          <LanguageSwitcher />
          <Link
            to="/app"
            className="text-sm text-ink/60 transition-colors hover:text-ink"
          >
            {t('signIn')}
          </Link>
        </div>
      </header>

      <main className="flex flex-1 flex-col items-center justify-center px-6 py-20 text-center sm:py-28">
        <h1 className="max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight sm:text-5xl md:text-6xl">
          {t('tagline')}
        </h1>
        <p className="mt-6 max-w-xl text-base text-ink/60 sm:text-lg">
          {t('heroSubtext')}
        </p>
        <Link
          to="/app"
          className="mt-10 inline-flex h-10 items-center justify-center rounded-sharp bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-ink/85 focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink"
        >
          {t('ctaStartSearch')}
        </Link>

        <div className="mt-24 grid w-full max-w-3xl grid-cols-1 gap-px overflow-hidden rounded-sharp border border-line bg-line sm:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="flex flex-col items-center gap-3 bg-paper px-6 py-8 text-center"
            >
              <Icon size={22} strokeWidth={1.5} className="text-ink" aria-hidden="true" />
              <span className="text-sm font-medium text-ink">{title}</span>
              <span className="text-xs text-ink/50">{text}</span>
            </div>
          ))}
        </div>
      </main>

      <footer className="border-t border-line px-6 py-6 text-center">
        <p className="text-xs text-ink/40">{t('footerNote')}</p>
      </footer>
    </div>
  )
}
