import type { Lang } from '@/shared/i18n/translations'

const LOCALES: Record<Lang, string> = {
  ru: 'ru-RU',
  en: 'en-US',
  kk: 'kk-KZ',
}

// Only allow http(s) URLs from untrusted marketplace data to reach an href or
// src sink, so a poisoned productUrl or imageUrl cannot become a javascript:
// link. Returns undefined for anything that is not a valid http(s) URL.
export function safeHttpUrl(raw: string | null | undefined): string | undefined {
  if (!raw) return undefined
  try {
    const url = new URL(raw)
    return url.protocol === 'http:' || url.protocol === 'https:'
      ? url.href
      : undefined
  } catch {
    return undefined
  }
}

export function formatPrice(price: number, currency: string, lang: Lang): string {
  return `${Math.round(price).toLocaleString(LOCALES[lang])} ${currency}`
}
