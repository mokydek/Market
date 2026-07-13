import { useI18n } from '@/shared/i18n/I18nProvider'
import type { Lang } from '@/shared/i18n/translations'

const OPTIONS: ReadonlyArray<{ code: Lang; label: string }> = [
  { code: 'ru', label: 'RU' },
  { code: 'en', label: 'EN' },
  { code: 'kk', label: 'KZ' },
]

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n()

  return (
    <div className="flex items-center gap-3 text-sm">
      {OPTIONS.map(({ code, label }) => {
        const active = code === lang
        return (
          <button
            key={code}
            type="button"
            onClick={() => setLang(code)}
            className={
              active
                ? 'font-semibold text-ink underline underline-offset-4'
                : 'text-ink/40 transition-colors hover:text-ink'
            }
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}
