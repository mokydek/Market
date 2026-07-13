import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { useAuth } from '@/shared/auth/AuthProvider'
import { authErrorKey } from '@/shared/auth/errors'
import { Input } from '@/shared/components/Input'
import { Button } from '@/shared/components/Button'

export default function SignUp() {
  const { t } = useI18n()
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setBusy(true)
    setError(null)
    setNotice(null)
    const result = await signUp(email, password)
    setBusy(false)
    if (result.error) {
      setError(t(authErrorKey(result.error)))
      return
    }
    if (result.needsConfirmation) {
      setNotice(t('checkEmail'))
      return
    }
    navigate('/app')
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col px-6 py-16">
      <h1 className="font-display text-2xl font-semibold tracking-tight">
        {t('signUp')}
      </h1>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-ink/60">{t('email')}</span>
          <Input
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-xs text-ink/60">{t('password')}</span>
          <Input
            type="password"
            autoComplete="new-password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error && (
          <p className="rounded-sharp border border-line px-3 py-2 text-xs text-ink">
            {error}
          </p>
        )}
        {notice && (
          <p className="rounded-sharp border border-line px-3 py-2 text-xs text-ink">
            {notice}
          </p>
        )}
        <Button type="submit" disabled={busy}>
          {busy ? t('loading') : t('signUp')}
        </Button>
      </form>
      <p className="mt-6 text-center text-xs text-ink/50">
        <Link
          to="/app/sign-in"
          className="underline underline-offset-4 hover:text-ink"
        >
          {t('signIn')}
        </Link>
      </p>
    </div>
  )
}
