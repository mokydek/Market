import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { translations } from './translations'
import type { Lang, TranslationKey } from './translations'

const STORAGE_KEY = 'market.lang'

function isLang(value: unknown): value is Lang {
  return value === 'ru' || value === 'en' || value === 'kk'
}

function readInitialLang(): Lang {
  const stored = localStorage.getItem(STORAGE_KEY)
  return isLang(stored) ? stored : 'ru'
}

type I18nContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readInitialLang)

  const setLang = useCallback((next: Lang) => {
    setLangState(next)
    localStorage.setItem(STORAGE_KEY, next)
  }, [])

  // Keep <html lang> in sync with the active language, on first mount
  // (covers a persisted choice) and on every switch.
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const t = useCallback(
    (key: TranslationKey): string => translations[lang][key],
    [lang],
  )

  return (
    <I18nContext.Provider value={{ lang, setLang, t }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return ctx
}
