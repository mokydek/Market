// Frontend mirror of supabase/functions/_shared/types.ts. Keep the two in sync.
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
