import { assertEquals } from 'jsr:@std/assert@1'
import { mapWildberries, wbImageUrl } from './wildberries.ts'

// Saved sample shaped like the search.wb.ru catalog response products.
const SAMPLE = [
  { id: 12345678, name: 'Телефон X', salePriceU: 5499000, reviewRating: 4.7, feedbacks: 1200 },
  { id: 99, name: 'Без цены', reviewRating: 4.0, feedbacks: 3 },
]

Deno.test('maps price from minor units and core fields', () => {
  const [first] = mapWildberries(SAMPLE)
  assertEquals(first.id, 'wildberries-12345678')
  assertEquals(first.marketplaceId, 'wildberries')
  assertEquals(first.title, 'Телефон X')
  assertEquals(first.price, 54990)
  assertEquals(first.currency, 'KZT')
  assertEquals(first.rating, 4.7)
  assertEquals(first.reviewCount, 1200)
  assertEquals(first.isB2B, false)
  assertEquals(
    first.productUrl,
    'https://www.wildberries.ru/catalog/12345678/detail.aspx',
  )
})

Deno.test('missing price falls back to 0', () => {
  const offers = mapWildberries(SAMPLE)
  assertEquals(offers[1].price, 0)
  assertEquals(offers[1].reviewCount, 3)
})

Deno.test('image url uses a basket host derived from id', () => {
  const url = wbImageUrl(12345678)
  assertEquals(url.includes('/vol123/'), true)
  assertEquals(url.includes('/part12345/'), true)
  assertEquals(url.startsWith('https://basket-'), true)
})
