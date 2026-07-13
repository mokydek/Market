import type { Offer } from '../types.ts'
import type { Adapter } from './types.ts'

const MARKETPLACE_ID = 'alibaba'

// Alibaba is wholesale: prices come as a range across order quantities. We keep
// the min as the offer price and stash the full range in raw.
export type AlibabaItem = {
  productId: string
  title: string
  priceMin: number
  priceMax: number
  currency: string
  image: string | null
  url: string
}

function normalizeUrl(url: string): string {
  if (url.startsWith('http')) return url
  if (url.startsWith('//')) return `https:${url}`
  return `https://www.alibaba.com${url}`
}

function normalizeImage(image: string | null): string | null {
  if (!image) return null
  return image.startsWith('//') ? `https:${image}` : image
}

export function mapAlibaba(items: AlibabaItem[]): Offer[] {
  return items
    .filter((it) => Boolean(it.productId))
    .map((it) => ({
      id: `${MARKETPLACE_ID}-${it.productId}`,
      marketplaceId: MARKETPLACE_ID,
      title: it.title,
      price: it.priceMin,
      currency: it.currency,
      rating: null,
      reviewCount: 0,
      imageUrl: normalizeImage(it.image),
      productUrl: normalizeUrl(it.url),
      isB2B: true,
      raw: { priceMin: it.priceMin, priceMax: it.priceMax },
    }))
}

// Parse a price range like "$1.20 - $3.50" or "1.20-3.50" into [min, max].
export function parsePriceRange(text: string): [number, number] {
  const numbers = (text.match(/\d+(?:[.,]\d+)?/g) ?? []).map((n) =>
    Number(n.replace(',', '.')),
  )
  if (numbers.length === 0) return [0, 0]
  const min = Math.min(...numbers)
  const max = Math.max(...numbers)
  return [min, max]
}

type AlibabaRawItem = {
  productId?: string | number
  id?: string | number
  title?: string
  subject?: string
  price?: string
  priceRange?: string
  currency?: string
  image?: string
  imageUrl?: string
  productUrl?: string
  detailUrl?: string
}

function toItems(raw: unknown): AlibabaItem[] {
  const root = raw as { data?: { offerList?: AlibabaRawItem[] }; offerList?: AlibabaRawItem[] }
  const list = root.data?.offerList ?? root.offerList ?? []
  return list.map((it) => {
    const [priceMin, priceMax] = parsePriceRange(it.priceRange ?? it.price ?? '')
    return {
      productId: String(it.productId ?? it.id ?? ''),
      title: it.title ?? it.subject ?? '',
      priceMin,
      priceMax,
      currency: it.currency ?? 'USD',
      image: it.image ?? it.imageUrl ?? null,
      url: it.productUrl ?? it.detailUrl ?? '',
    }
  })
}

export const alibabaAdapter: Adapter = {
  async search(query: string): Promise<Offer[]> {
    const url = `https://www.alibaba.com/trade/search?SearchText=${encodeURIComponent(query)}`
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        Accept: 'application/json',
        'Accept-Language': 'en',
      },
    })
    if (!res.ok) throw new Error(`alibaba ${res.status}`)
    const data = await res.json()
    return mapAlibaba(toItems(data)).slice(0, 20)
  },
}
