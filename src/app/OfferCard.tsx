import { ExternalLink, Heart } from 'lucide-react'
import type { ScoredOffer } from '@/shared/types/offer'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { MARKETPLACE_NAMES } from '@/shared/marketplaces'
import { useFavorites } from '@/shared/favorites/FavoritesProvider'
import { formatPrice, safeHttpUrl } from '@/shared/format'

function Badge({ children }: { children: string }) {
  return (
    <span className="rounded-sharp border border-ink px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-ink">
      {children}
    </span>
  )
}

type OfferCardProps = {
  offer: ScoredOffer
  isBestValue: boolean
  isCheapest: boolean
  onOpenDetail: (offer: ScoredOffer) => void
}

export function OfferCard({
  offer,
  isBestValue,
  isCheapest,
  onOpenDetail,
}: OfferCardProps) {
  const { t, lang } = useI18n()
  const { enabled, isFavorite, toggle } = useFavorites()
  const fav = isFavorite(offer.productUrl)
  const valueIndex = Math.round(offer.valueScore * 100)
  const price = formatPrice(offer.price, offer.currency, lang)
  const href = safeHttpUrl(offer.productUrl)
  const img = safeHttpUrl(offer.imageUrl)

  return (
    <div className="flex flex-col gap-3 rounded-sharp border border-line p-4 sm:flex-row sm:items-center sm:gap-4">
      {img && (
        <img
          src={img}
          alt=""
          width={64}
          height={64}
          loading="lazy"
          className="h-16 w-16 shrink-0 rounded-sharp border border-line object-cover"
        />
      )}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {isBestValue && <Badge>{t('bestValue')}</Badge>}
          {isCheapest && <Badge>{t('cheapest')}</Badge>}
          {offer.isB2B && <Badge>{t('b2bBadge')}</Badge>}
        </div>
        <button
          type="button"
          onClick={() => onOpenDetail(offer)}
          className="mt-1.5 block max-w-full truncate text-left text-sm font-medium text-ink underline-offset-4 hover:underline"
        >
          {offer.title}
        </button>
        <p className="text-xs text-ink/50">
          {MARKETPLACE_NAMES[offer.marketplaceId] ?? offer.marketplaceId}
        </p>
        <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-ink/60">
          <span>
            {t('priceLabel')}: {price}
          </span>
          {offer.rating !== null && (
            <span>
              {t('ratingLabel')}: {offer.rating.toFixed(1)}
            </span>
          )}
          <span>
            {t('reviewsLabel')}: {offer.reviewCount}
          </span>
          <span>
            {t('valueIndex')}: {valueIndex}
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {enabled && (
          <button
            type="button"
            onClick={() => void toggle(offer)}
            aria-label={fav ? t('removeFavorite') : t('addFavorite')}
            aria-pressed={fav}
            className="flex h-10 w-10 items-center justify-center rounded-sharp border border-line text-ink transition-colors hover:bg-ink/5"
          >
            <Heart
              size={18}
              strokeWidth={1.5}
              fill={fav ? 'currentColor' : 'none'}
              aria-hidden="true"
            />
          </button>
        )}
        {href && (
          <a
            href={href}
            target="_blank"
            rel="noreferrer noopener"
            className="inline-flex h-10 items-center justify-center gap-1.5 rounded-sharp border border-ink bg-paper px-4 text-sm font-medium text-ink transition-colors hover:bg-ink/5"
          >
            <ExternalLink size={14} strokeWidth={1.5} aria-hidden="true" />
            {t('openOnMarketplace')}
          </a>
        )}
      </div>
    </div>
  )
}
