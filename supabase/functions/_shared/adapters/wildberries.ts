import type { Offer } from '../types.ts'
import type { Adapter } from './types.ts'

const MARKETPLACE_ID = 'wildberries'
const CURRENCY = 'KZT'

export type WbProduct = {
  id: number
  name?: string
  salePriceU?: number
  priceU?: number
  rating?: number
  reviewRating?: number
  feedbacks?: number
}

// Wildberries serves images from sharded "basket" hosts; the host is derived
// from the product id volume. Ranges shift over time, so this is best effort.
export function wbImageUrl(id: number): string {
  const vol = Math.floor(id / 100000)
  const part = Math.floor(id / 1000)
  let basket = '18'
  if (vol <= 143) basket = '01'
  else if (vol <= 287) basket = '02'
  else if (vol <= 431) basket = '03'
  else if (vol <= 719) basket = '04'
  else if (vol <= 1007) basket = '05'
  else if (vol <= 1061) basket = '06'
  else if (vol <= 1115) basket = '07'
  else if (vol <= 1169) basket = '08'
  else if (vol <= 1313) basket = '09'
  else if (vol <= 1601) basket = '10'
  else if (vol <= 1655) basket = '11'
  else if (vol <= 1919) basket = '12'
  else if (vol <= 2045) basket = '13'
  else if (vol <= 2189) basket = '14'
  else if (vol <= 2405) basket = '15'
  else if (vol <= 2621) basket = '16'
  else if (vol <= 2837) basket = '17'
  return `https://basket-${basket}.wbbasket.ru/vol${vol}/part${part}/${id}/images/c246x328/1.webp`
}

// Pure mapper (unit tested against a saved sample). salePriceU is in the minor
// currency unit (x100).
export function mapWildberries(products: WbProduct[]): Offer[] {
  return products
    .filter((p) => typeof p.id === 'number')
    .map((p) => {
      const priceRaw = p.salePriceU ?? p.priceU ?? 0
      return {
        id: `${MARKETPLACE_ID}-${p.id}`,
        marketplaceId: MARKETPLACE_ID,
        title: p.name ?? '',
        price: Math.round((priceRaw / 100) * 100) / 100,
        currency: CURRENCY,
        rating: p.reviewRating ?? p.rating ?? null,
        reviewCount: p.feedbacks ?? 0,
        imageUrl: wbImageUrl(p.id),
        productUrl: `https://www.wildberries.ru/catalog/${p.id}/detail.aspx`,
        isB2B: false,
      }
    })
}

export const wildberriesAdapter: Adapter = {
  async search(query: string): Promise<Offer[]> {
    const url =
      'https://search.wb.ru/exactmatch/ru/common/v5/search' +
      `?ab_testing=false&appType=1&curr=kzt&dest=-1257786&query=${encodeURIComponent(query)}` +
      '&resultset=catalog&sort=popular&spp=30&suppressSpellcheck=false'
    const res = await fetch(url, {
      headers: { Accept: 'application/json', 'User-Agent': 'Mozilla/5.0' },
    })
    if (!res.ok) throw new Error(`wildberries ${res.status}`)
    const data = (await res.json()) as { data?: { products?: WbProduct[] } }
    const products = data.data?.products ?? []
    return mapWildberries(products.slice(0, 20))
  },
}
