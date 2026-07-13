import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { useAuth } from '@/shared/auth/AuthProvider'
import { supabase } from '@/shared/lib/supabase'
import { Spinner } from '@/shared/components/Spinner'

type SearchRow = { id: string; query: string; created_at: string }

export default function History() {
  const { t } = useI18n()
  const { user } = useAuth()
  const [rows, setRows] = useState<SearchRow[] | null>(null)

  useEffect(() => {
    if (!user) return
    let active = true
    const load = async () => {
      const { data } = await supabase
        .from('searches')
        .select('id, query, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)
      if (active) setRows((data ?? []) as SearchRow[])
    }
    void load()
    return () => {
      active = false
    }
  }, [user])

  // Collapse repeated queries, keeping the most recent occurrence.
  const seen = new Set<string>()
  const unique = (rows ?? []).filter((row) => {
    if (seen.has(row.query)) return false
    seen.add(row.query)
    return true
  })

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-6 py-10">
      <h1 className="font-display text-2xl font-semibold tracking-tight">
        {t('history')}
      </h1>

      {rows === null && (
        <div className="mt-10 flex justify-center">
          <Spinner size={24} />
        </div>
      )}

      {rows !== null && unique.length === 0 && (
        <p className="mt-10 text-sm text-ink/50">{t('historyEmpty')}</p>
      )}

      {unique.length > 0 && (
        <ul className="mt-8 flex flex-col divide-y divide-line rounded-sharp border border-line">
          {unique.map((row) => (
            <li key={row.id}>
              <Link
                to={`/app?q=${encodeURIComponent(row.query)}`}
                className="flex items-center justify-between gap-3 px-4 py-3 text-sm text-ink transition-colors hover:bg-ink/5"
              >
                <span className="truncate">{row.query}</span>
                <Search
                  size={14}
                  strokeWidth={1.5}
                  className="shrink-0 text-ink/40"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
