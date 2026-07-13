import { assertEquals } from 'jsr:@std/assert@1'
import { mapOzon } from './ozon.ts'
import type { OzonItem } from './ozon.ts'

const SAMPLE: OzonItem[] = [
  {
    sku: 55501,
    title: 'Наушники Pro',
    price: 24990,
    currency: 'KZT',
    rating: 4.5,
    reviewCount: 300,
    image: 'https://img.example/1.jpg',
    link: '/product/55501/',
  },
  {
    sku: 0,
    title: 'invalid',
    price: 0,
    currency: 'KZT',
    rating: null,
    reviewCount: 0,
    image: null,
    link: '/x',
  },
]

Deno.test('maps ozon items and builds absolute product url', () => {
  const offers = mapOzon(SAMPLE)
  assertEquals(offers.length, 1) // sku 0 dropped
  const [first] = offers
  assertEquals(first.id, 'ozon-55501')
  assertEquals(first.marketplaceId, 'ozon')
  assertEquals(first.title, 'Наушники Pro')
  assertEquals(first.price, 24990)
  assertEquals(first.productUrl, 'https://www.ozon.ru/product/55501/')
  assertEquals(first.isB2B, false)
})

Deno.test('keeps absolute links unchanged', () => {
  const offers = mapOzon([{ ...SAMPLE[0], link: 'https://www.ozon.ru/product/9/' }])
  assertEquals(offers[0].productUrl, 'https://www.ozon.ru/product/9/')
})
