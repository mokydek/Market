import type { TranslationKey } from '@/shared/i18n/translations'

// Map a raw Supabase auth error message to a localized translation key.
// Falls back to errorGeneric for anything unrecognized.
export function authErrorKey(message: string): TranslationKey {
  const m = message.toLowerCase()
  if (m.includes('invalid login')) return 'authInvalidCredentials'
  if (m.includes('already registered') || m.includes('already exists')) {
    return 'authUserExists'
  }
  if (
    m.includes('password') &&
    (m.includes('at least') || m.includes('6') || m.includes('short'))
  ) {
    return 'authWeakPassword'
  }
  if (m.includes('email') && (m.includes('invalid') || m.includes('valid'))) {
    return 'authInvalidEmail'
  }
  return 'errorGeneric'
}
