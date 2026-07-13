import type { Offer } from '../types.ts'
import type { Adapter } from './types.ts'

const MARKETPLACE_ID = 'kaspi'
// Almaty. Kaspi results are city scoped; the search needs a city id + cookie.
const CITY_ID = '750000000'

export type KaspiItem = {
  id: string
  title: string
  price: number
  rating: number | null
  reviewCount: number
  image: string | null
  link: string
}

export function mapKaspi(items: KaspiItem[]): Offer[] {
  return items
    .filter((it) => Boolean(it.id))
    .map((it) => ({
      id: `${MARKETPLACE_ID}-${it.id}`,
      marketplaceId: MARKETPLACE_ID,
      title: it.title,
      price: it.price,
      currency: 'KZT',
      rating: it.rating,
      reviewCount: it.reviewCount,
      imageUrl: it.image,
      productUrl: it.link.startsWith('http')
        ? it.link
        : `https://kaspi.kz${it.link}`,
      isB2B: false,
    }))
}

type KaspiCard = {
  id?: string | number
  title?: string
  unitPrice?: number
  price?: number
  rating?: number
  reviewsQuantity?: number
  previewImages?: Array<{ medium?: string; small?: string }>
  shopLink?: string
}

function toItems(raw: unknown): KaspiItem[] {
  const root = raw as { data?: { cards?: KaspiCard[] } }
  const cards = root.data?.cards ?? []
  return cards.map((c) => ({
    id: String(c.id ?? ''),
    title: c.title ?? '',
    price: c.unitPrice ?? c.price ?? 0,
    rating: c.rating ?? null,
    reviewCount: c.reviewsQuantity ?? 0,
    image: c.previewImages?.[0]?.medium ?? c.previewImages?.[0]?.small ?? null,
    link: c.shopLink ?? '',
  }))
}

// NOTE: Kaspi has strong anti bot protection (Cloudflare plus a required city
// cookie) and blocks datacenter IPs. From a Supabase Edge Function this call
// will almost always throw, which the pipeline reports as blocked. Realistic
// ways to make Kaspi live:
//   1. Official Kaspi merchant/partner API access (best, if granted).
//   2. A paid scraping or residential proxy provider fronting this request.
//   3. A small separate worker on a residential/whitelisted IP that this
//      function calls instead of hitting kaspi.kz directly.
export const kaspiAdapter: Adapter = {
  async search(query: string): Promise<Offer[]> {
    const url =
      'https://kaspi.kz/yml/product-view/pl/results' +
      `?text=${encodeURIComponent(query)}&page=0&all=false&sortOption=relevance` +
      `&fl=true&ui=d&i=-1&c=${CITY_ID}`
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        Accept: 'application/json, text/plain, */*',
        'Accept-Language': 'ru,kk;q=0.9',
        Referer: 'https://kaspi.kz/shop/',
        'X-KS-City': CITY_ID,
        Cookie: `kaspi.storefront.cookie.city=${CITY_ID}`,
      },
    })
    if (!res.ok) throw new Error(`kaspi ${res.status}`)
    const data = await res.json()
    return mapKaspi(toItems(data)).slice(0, 20)
  },
}
