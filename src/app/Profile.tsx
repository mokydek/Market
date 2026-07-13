import { useEffect, useState } from 'react'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { useAuth } from '@/shared/auth/AuthProvider'
import { supabase } from '@/shared/lib/supabase'
import { Button } from '@/shared/components/Button'

export default function Profile() {
  const { t } = useI18n()
  const { user, signOut } = useAuth()
  const [displayName, setDisplayName] = useState<string | null>(null)

  useEffect(() => {
    if (!user) return
    let active = true
    const load = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('id', user.id)
        .maybeSingle()
      if (active) {
        const row = data as { display_name: string | null } | null
        setDisplayName(row?.display_name ?? null)
      }
    }
    void load()
    return () => {
      active = false
    }
  }, [user])

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col px-6 py-16">
      <h1 className="font-display text-2xl font-semibold tracking-tight">
        {t('profile')}
      </h1>
      <dl className="mt-8 flex flex-col gap-4 text-sm">
        <div className="flex flex-col gap-1">
          <dt className="text-xs text-ink/50">{t('email')}</dt>
          <dd className="text-ink">{user?.email}</dd>
        </div>
        {displayName && (
          <div className="flex flex-col gap-1">
            <dt className="text-xs text-ink/50">{t('displayName')}</dt>
            <dd className="text-ink">{displayName}</dd>
          </div>
        )}
      </dl>
      <div className="mt-8">
        <Button variant="secondary" onClick={() => void signOut()}>
          {t('signOut')}
        </Button>
      </div>
    </div>
  )
}
