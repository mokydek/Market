import type { Offer, ScoredOffer } from './types.ts'

// valueScore = quality * 0.6 + price * 0.4. Exposed so tests and the UI agree.
export const VALUE_WEIGHTS = { quality: 0.6, price: 0.4 } as const
// Higher K means more reviews are needed before a rating is fully trusted.
export const RATING_CONFIDENCE_K = 20

// Pure scoring. Ranks offers by valueScore descending, breaking ties by
// reviewCount descending. Every score is in the 0..1 range.
export function scoreOffers(offers: Offer[]): ScoredOffer[] {
  if (offers.length === 0) return []

  // Cheapest price per currency. Offers in different currencies (KZT retail vs
  // USD wholesale) must not share one minimum, or the dollar amounts would
  // always look cheaper and unfairly win the price score.
  const minByCurrency = new Map<string, number>()
  for (const o of offers) {
    if (o.price > 0) {
      const current = minByCurrency.get(o.currency)
      if (current === undefined || o.price < current) {
        minByCurrency.set(o.currency, o.price)
      }
    }
  }

  const scored: ScoredOffer[] = offers.map((offer) => {
    const ratingConfidence =
      offer.reviewCount / (offer.reviewCount + RATING_CONFIDENCE_K)
    const qualityScore = ((offer.rating ?? 0) / 5) * ratingConfidence
    const minPrice = minByCurrency.get(offer.currency) ?? 0
    const priceScore =
      offer.price > 0 && minPrice > 0 ? minPrice / offer.price : 0
    const valueScore =
      VALUE_WEIGHTS.quality * qualityScore + VALUE_WEIGHTS.price * priceScore
    return { ...offer, qualityScore, priceScore, valueScore }
  })

  scored.sort(
    (a, b) => b.valueScore - a.valueScore || b.reviewCount - a.reviewCount,
  )
  return scored
}
