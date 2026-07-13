// Unified offer shape shared by every marketplace adapter and the search
// function. Mirrored on the frontend in src/shared/types/offer.ts.
export type Lang = 'ru' | 'en' | 'kk'

export interface Offer {
  id: string
  marketplaceId: string
  title: string
  price: number
  currency: string
  rating: number | null
  reviewCount: number
  imageUrl: string | null
  productUrl: string
  isB2B: boolean
  raw?: unknown
}

export interface ScoredOffer extends Offer {
  qualityScore: number
  priceScore: number
  valueScore: number
}
