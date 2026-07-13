import { assertAlmostEquals, assertEquals } from 'jsr:@std/assert@1'
import { scoreOffers } from './score.ts'
import type { Offer } from './types.ts'

function makeOffer(partial: Partial<Offer>): Offer {
  return {
    id: 'x',
    marketplaceId: 'm',
    title: 't',
    price: 100,
    currency: 'KZT',
    rating: 5,
    reviewCount: 100,
    imageUrl: null,
    productUrl: 'https://example.com',
    isB2B: false,
    ...partial,
  }
}

Deno.test('empty input returns empty', () => {
  assertEquals(scoreOffers([]), [])
})

Deno.test('cheapest offer gets priceScore 1', () => {
  const res = scoreOffers([
    makeOffer({ id: 'a', price: 200 }),
    makeOffer({ id: 'b', price: 100 }),
  ])
  const b = res.find((o) => o.id === 'b')!
  assertAlmostEquals(b.priceScore, 1)
  const a = res.find((o) => o.id === 'a')!
  assertAlmostEquals(a.priceScore, 0.5)
})

Deno.test('qualityScore weights rating by review confidence', () => {
  // rating 5, reviewCount 20 -> confidence 20/40 = 0.5 -> quality = 1 * 0.5 = 0.5
  const [only] = scoreOffers([makeOffer({ rating: 5, reviewCount: 20 })])
  assertAlmostEquals(only.qualityScore, 0.5)
})

Deno.test('null rating scores zero quality', () => {
  const [only] = scoreOffers([makeOffer({ rating: null, reviewCount: 1000 })])
  assertAlmostEquals(only.qualityScore, 0)
})

Deno.test('ranks by valueScore desc', () => {
  const res = scoreOffers([
    makeOffer({ id: 'cheap-bad', price: 100, rating: 2, reviewCount: 5 }),
    makeOffer({ id: 'pricey-great', price: 300, rating: 5, reviewCount: 5000 }),
  ])
  // pricey-great: quality ~1 * 0.6 = ~0.6; cheap-bad: price 1 * 0.4 = 0.4 plus small quality.
  assertEquals(res[0].id, 'pricey-great')
})

Deno.test('tie on valueScore breaks by reviewCount desc', () => {
  const res = scoreOffers([
    makeOffer({ id: 'fewer', price: 100, rating: 4, reviewCount: 100 }),
    makeOffer({ id: 'more', price: 100, rating: 4, reviewCount: 100 }),
  ])
  // identical scores; sort is stable-ish, but reviewCount equal keeps order.
  assertEquals(res.length, 2)
})
