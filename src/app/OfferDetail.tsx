import { X } from 'lucide-react'
import type { ScoredOffer } from '@/shared/types/offer'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { MARKETPLACE_NAMES } from '@/shared/marketplaces'

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between border-b border-line pb-2">
      <dt className="text-ink/50">{label}</dt>
      <dd className="text-ink">{value}</dd>
    </div>
  )
}

type OfferDetailProps = {
  offer: ScoredOffer
  onClose: () => void
}

export function OfferDetail({ offer, onClose }: OfferDetailProps) {
  const { t } = useI18n()
  const valueIndex = Math.round(offer.valueScore * 100)
  const quality = Math.round(offer.qualityScore * 100)
  const priceScore = Math.round(offer.priceScore * 100)
  const price = `${Math.round(offer.price).toLocaleString('ru-RU')} ${offer.currency}`

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-ink/20"
      onClick={onClose}
    >
      <div
        className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-paper p-6"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <p className="text-xs text-ink/50">
            {MARKETPLACE_NAMES[offer.marketplaceId] ?? offer.marketplaceId}
          </p>
          <button
            type="button"
            onClick={onClose}
            aria-label={t('close')}
            className="text-ink/50 transition-colors hover:text-ink"
          >
            <X size={18} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>

        {offer.imageUrl && (
          <img
            src={offer.imageUrl}
            alt=""
            width={192}
            height={192}
            className="mt-4 h-48 w-48 self-center rounded-sharp border border-line object-cover"
          />
        )}

        <h2 className="mt-4 font-display text-lg font-semibold tracking-tight">
          {offer.title}
        </h2>

        <dl className="mt-4 flex flex-col gap-2 text-sm">
          <Row label={t('priceLabel')} value={price} />
          {offer.rating !== null && (
            <Row label={t('ratingLabel')} value={offer.rating.toFixed(1)} />
          )}
          <Row label={t('reviewsLabel')} value={String(offer.reviewCount)} />
          <Row label={t('qualityLabel')} value={String(quality)} />
          <Row label={t('priceScoreLabel')} value={String(priceScore)} />
          <Row label={t('valueIndex')} value={String(valueIndex)} />
        </dl>

        <p className="mt-4 text-xs text-ink/50">{t('scoreExplanation')}</p>

        <a
          href={offer.productUrl}
          target="_blank"
          rel="noreferrer noopener"
          className="mt-6 inline-flex h-10 items-center justify-center rounded-sharp bg-ink px-5 text-sm font-medium text-paper transition-colors hover:bg-ink/85"
        >
          {t('openOnMarketplace')}
        </a>
      </div>
    </div>
  )
}
