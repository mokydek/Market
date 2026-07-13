import type { Offer } from '../types.ts'
import type { Adapter } from './types.ts'

const MARKETPLACE_ID = 'aliexpress'

export type AliItem = {
  productId: string
  title: string
  price: number
  currency: string
  rating: number | null
  reviewCount: number
  image: string | null
}

function normalizeImage(image: string | null): string | null {
  if (!image) return null
  return image.startsWith('//') ? `https:${image}` : image
}

export function mapAliexpress(items: AliItem[]): Offer[] {
  return items
    .filter((it) => Boolean(it.productId))
    .map((it) => ({
      id: `${MARKETPLACE_ID}-${it.productId}`,
      marketplaceId: MARKETPLACE_ID,
      title: it.title,
      price: it.price,
      currency: it.currency,
      rating: it.rating,
      reviewCount: it.reviewCount,
      imageUrl: normalizeImage(it.image),
      productUrl: `https://www.aliexpress.com/item/${it.productId}.html`,
      isB2B: false,
    }))
}

function digits(text: string): number {
  // Review/sold counts are integers; strip everything non digit so a value like
  // "1.2.3 sold" cannot become NaN and poison the sort.
  const only = text.replace(/[^\d]/g, '')
  const n = Number(only)
  return Number.isFinite(n) ? n : 0
}

type AliRawItem = {
  productId?: string | number
  productIds?: string
  title?: string | { displayTitle?: string }
  prices?: { salePrice?: { minPrice?: number; currencyCode?: string } }
  trade?: { tradeDesc?: string }
  evaluation?: { starRating?: number }
  image?: { imgUrl?: string }
}

function toItems(raw: unknown): AliItem[] {
  const root = raw as {
    data?: { itemList?: { content?: AliRawItem[] } }
    result?: { mods?: { itemList?: { content?: AliRawItem[] } } }
  }
  const list =
    root.data?.itemList?.content ??
    root.result?.mods?.itemList?.content ??
    []
  return list.map((it) => {
    const title =
      typeof it.title === 'string' ? it.title : (it.title?.displayTitle ?? '')
    const reviews = it.trade?.tradeDesc ? digits(it.trade.tradeDesc) : 0
    return {
      productId: String(it.productId ?? it.productIds ?? ''),
      title,
      price: it.prices?.salePrice?.minPrice ?? 0,
      currency: it.prices?.salePrice?.currencyCode ?? 'USD',
      rating: it.evaluation?.starRating ?? null,
      reviewCount: reviews,
      image: it.image?.imgUrl ?? null,
    }
  })
}

export const aliexpressAdapter: Adapter = {
  async search(query: string): Promise<Offer[]> {
    const url = `https://www.aliexpress.com/fn/search-pc/index?keyword=${encodeURIComponent(query)}`
    const res = await fetch(url, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
        Accept: 'application/json',
        'Accept-Language': 'en,ru;q=0.9',
      },
    })
    if (!res.ok) throw new Error(`aliexpress ${res.status}`)
    const data = await res.json()
    return mapAliexpress(toItems(data)).slice(0, 20)
  },
}
