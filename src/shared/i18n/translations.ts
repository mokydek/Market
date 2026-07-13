export type Lang = 'ru' | 'en' | 'kk'

// Russian is the source of truth. Its keys define TranslationKey, and the
// `satisfies` below forces en and kk to provide every one of them, so a
// missing translation is a build error rather than a silent fallback.
const ru = {
  appName: 'Market',
  tagline: 'Лучшие товары по цене и качеству',
  landingNote: 'Настоящий лендинг появится в Фазе 4',
  appTitle: 'Основное приложение',
  appNote: 'Поиск по маркетплейсам появится начиная с Фазы 6',
  signIn: 'Войти',
} as const

export type TranslationKey = keyof typeof ru

export const translations = {
  ru,
  en: {
    appName: 'Market',
    tagline: 'The best products by price and quality',
    landingNote: 'The real landing page arrives in Phase 4',
    appTitle: 'Main application',
    appNote: 'Marketplace search arrives starting from Phase 6',
    signIn: 'Sign in',
  },
  kk: {
    appName: 'Market',
    tagline: 'Баға мен сапа бойынша үздік тауарлар',
    landingNote: 'Нағыз лендинг 4 фазада пайда болады',
    appTitle: 'Негізгі қосымша',
    appNote: 'Маркетплейс іздеу 6 фазадан бастап қосылады',
    signIn: 'Кіру',
  },
} satisfies Record<Lang, Record<TranslationKey, string>>
