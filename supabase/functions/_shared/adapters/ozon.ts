import type { Offer } from '../types.ts'
import type { Adapter } from './types.ts'

const MARKETPLACE_ID = 'ozon'

// Intermediate shape the mapper consumes. Extraction from Ozon's raw page is
// best effort (Ozon embeds results as stringified widget states).
export type OzonItem = {
  sku: number
  title: string
  price: number
  currency: string
  rating: number | null
  reviewCount: number
  image: string | null
  link: string
}

export function mapOzon(items: OzonItem[]): Offer[] {
  return items
    .filter((it) => it.sku > 0)
    .map((it) => ({
      id: `${MARKETPLACE_ID}-${it.sku}`,
      marketplaceId: MARKETPLACE_ID,
      title: it.title,
      price: it.price,
      currency: it.currency,
      rating: it.rating,
      reviewCount: it.reviewCount,
      imageUrl: it.image,
      productUrl: it.link.startsWith('http')
        ? it.link
        : `https://www.ozon.ru${it.link}`,
      isB2B: false,
    }))
}

function digits(text: string): number {
  const only = text.replace(/[^\d]/g, '')
  return only ? Number(only) : 0
}

type OzonRawItem = {
  sku?: number
  action?: { link?: string }
  tileImage?: { items?: Array<{ image?: { link?: string } }> }
  mainState?: Array<{
    id?: string
    atom?: {
      price?: { price?: string }
      textAtom?: { text?: string }
    }
  }>
}

// Pull the fields we need out of one Ozon tile, defensively.
function toItem(raw: OzonRawItem): OzonItem | null {
  const sku = raw.sku ?? 0
  if (!sku) return null
  let title = ''
  let price = 0
  for (const state of raw.mainState ?? []) {
    const priceText = state.atom?.price?.price
    if (priceText && !price) price = digits(priceText)
    const text = state.atom?.textAtom?.text
    if (text && state.id === 'name' && !title) title = text
  }
  const image = raw.tileImage?.items?.[0]?.image?.link ?? null
  return {
    sku,
    title,
    price,
    currency: 'KZT',
    rating: null,
    reviewCount: 0,
    image,
    link: raw.action?.link ?? `/product/${sku}/`,
  }
}

function extractItems(widgetStates: Record<string, string>): OzonItem[] {
  const items: OzonItem[] = []
  for (const [key, value] of Object.entries(widgetStates)) {
    if (!key.startsWith('searchResultsV2')) continue
    try {
      const state = JSON.parse(value) as { items?: OzonRawItem[] }
      for (const raw of state.items ?? []) {
        const item = toItem(raw)
        if (item) items.push(item)
      }
    } catch {
      // skip malformed widget state
    }
  }
  return items
}

export const ozonAdapter: Adapter = {
  async search(query: string): Promise<Offer[]> {
    const path = `/search/?text=${encodeURIComponent(query)}&from_global=true`
    const url = `https://www.ozon.ru/api/composer-api.bo/page/json/v2?url=${encodeURIComponent(path)}`
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        Accept: 'application/json',
        'Accept-Language': 'ru,kk;q=0.9',
      },
    })
    if (!res.ok) throw new Error(`ozon ${res.status}`)
    const data = (await res.json()) as { widgetStates?: Record<string, string> }
    return mapOzon(extractItems(data.widgetStates ?? {})).slice(0, 20)
  },
}
