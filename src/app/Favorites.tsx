import { useState } from 'react'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { useFavorites } from '@/shared/favorites/FavoritesProvider'
import { OfferCard } from '@/app/OfferCard'
import { OfferDetail } from '@/app/OfferDetail'
import type { ScoredOffer } from '@/shared/types/offer'

export default function Favorites() {
  const { t } = useI18n()
  const { favorites } = useFavorites()
  const [selected, setSelected] = useState<ScoredOffer | null>(null)

  const minPrice =
    favorites.length > 0
      ? Math.min(...favorites.map((o) => o.price).filter((p) => p > 0))
      : 0

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col px-6 py-10">
      <h1 className="font-display text-2xl font-semibold tracking-tight">
        {t('favorites')}
      </h1>

      {favorites.length === 0 && (
        <p className="mt-10 text-sm text-ink/50">{t('favoritesEmpty')}</p>
      )}

      {favorites.length > 0 && (
        <div className="mt-8 flex flex-col gap-3">
          {favorites.map((offer) => (
            <OfferCard
              key={offer.id}
              offer={offer}
              isBestValue={false}
              isCheapest={offer.price > 0 && offer.price === minPrice}
              onOpenDetail={setSelected}
            />
          ))}
        </div>
      )}

      {selected && (
        <OfferDetail offer={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}
