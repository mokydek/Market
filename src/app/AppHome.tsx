import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { supabase } from '@/shared/lib/supabase'
import type { ScoredOffer } from '@/shared/types/offer'
import { SearchBar } from '@/app/SearchBar'
import { OfferCard } from '@/app/OfferCard'
import { OfferDetail } from '@/app/OfferDetail'
import { Spinner } from '@/shared/components/Spinner'

type Status = 'idle' | 'loading' | 'done' | 'error'

export default function AppHome() {
  const { t, lang } = useI18n()
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get('q') ?? ''

  const [status, setStatus] = useState<Status>('idle')
  const [query, setQuery] = useState('')
  const [offers, setOffers] = useState<ScoredOffer[]>([])
  const [blocked, setBlocked] = useState<string[]>([])
  const [selected, setSelected] = useState<ScoredOffer | null>(null)

  const runSearch = useCallback(
    async (nextQuery: string) => {
      setStatus('loading')
      setQuery(nextQuery)
      const { data, error } = await supabase.functions.invoke('search', {
        body: { query: nextQuery, lang },
      })
      if (error || !data) {
        setStatus('error')
        return
      }
      const payload = data as {
        offers: ScoredOffer[]
        blockedMarketplaces: string[]
      }
      setOffers(payload.offers ?? [])
      setBlocked(payload.blockedMarketplaces ?? [])
      setStatus('done')
    },
    [lang],
  )

  // Rerun a search arriving from history (/app?q=...).
  useEffect(() => {
    if (initialQuery) void runSearch(initialQuery)
  }, [initialQuery, runSearch])

  const minPrice =
    offers.length > 0
      ? Math.min(...offers.map((o) => o.price).filter((p) => p > 0))
      : 0

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-6 py-10">
      <SearchBar
        key={initialQuery}
        initialValue={initialQuery}
        onSearch={runSearch}
        disabled={status === 'loading'}
      />

      {status === 'loading' && (
        <div className="mt-16 flex flex-col items-center gap-3">
          <Spinner size={24} />
          <p className="text-sm text-ink/50">{t('loading')}</p>
        </div>
      )}

      {status === 'error' && (
        <p className="mt-16 text-center text-sm text-ink/60">
          {t('errorGeneric')}
        </p>
      )}

      {status === 'done' && offers.length === 0 && (
        <p className="mt-16 text-center text-sm text-ink/60">{t('noResults')}</p>
      )}

      {status === 'done' && offers.length > 0 && (
        <div className="mt-8 flex flex-col gap-6">
          <p className="text-xs text-ink/50">
            {t('resultsFor')}: {query}
          </p>
          {blocked.length > 0 && (
            <p className="rounded-sharp border border-line px-3 py-2 text-xs text-ink/60">
              {t('marketplaceBlocked')}
            </p>
          )}
          <div className="flex flex-col gap-3">
            {offers.map((offer, index) => (
              <OfferCard
                key={offer.id}
                offer={offer}
                isBestValue={index === 0}
                isCheapest={offer.price > 0 && offer.price === minPrice}
                onOpenDetail={setSelected}
              />
            ))}
          </div>
        </div>
      )}

      {selected && (
        <OfferDetail offer={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
