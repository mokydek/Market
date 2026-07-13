import type { Offer } from '../types.ts'
import type { Adapter } from './types.ts'

type Template = {
  suffix: string
  price: number
  currency: string
  rating: number | null
  reviews: number
}

// Deterministic sample data, about eight offers spread across marketplaces,
// with varied price, rating and review counts so ranking is meaningful.
const TEMPLATES: Record<string, Template[]> = {
  wildberries: [
    { suffix: 'стандарт', price: 5490, currency: 'KZT', rating: 4.6, reviews: 1240 },
    { suffix: 'компакт', price: 4990, currency: 'KZT', rating: 4.3, reviews: 210 },
  ],
  ozon: [
    { suffix: 'плюс', price: 5990, currency: 'KZT', rating: 4.8, reviews: 2030 },
    { suffix: 'мини', price: 6490, currency: 'KZT', rating: 4.1, reviews: 54 },
  ],
  aliexpress: [
    { suffix: 'global', price: 3990, currency: 'KZT', rating: 4.4, reviews: 870 },
    { suffix: 'lite', price: 3490, currency: 'KZT', rating: 3.9, reviews: 33 },
  ],
  alibaba: [
    { suffix: 'wholesale', price: 2990, currency: 'KZT', rating: 4.2, reviews: 120 },
  ],
  kaspi: [
    { suffix: 'pro', price: 5290, currency: 'KZT', rating: 4.7, reviews: 640 },
  ],
}

export function createMockAdapter(marketplaceId: string, isB2B: boolean): Adapter {
  return {
    search(query: string): Promise<Offer[]> {
      const templates = TEMPLATES[marketplaceId] ?? []
      const offers: Offer[] = templates.map((tpl, index) => ({
        id: `${marketplaceId}-mock-${index}`,
        marketplaceId,
        title: `${query} ${tpl.suffix}`.trim(),
        price: tpl.price,
        currency: tpl.currency,
        rating: tpl.rating,
        reviewCount: tpl.reviews,
        imageUrl: null,
        productUrl: `https://example.com/${marketplaceId}/${index}`,
        isB2B,
      }))
      return Promise.resolve(offers)
    },
  }
}
