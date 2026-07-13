import { assertEquals } from 'jsr:@std/assert@1'
import { mapKaspi } from './kaspi.ts'
import type { KaspiItem } from './kaspi.ts'

const SAMPLE: KaspiItem[] = [
  {
    id: '101010',
    title: 'Смартфон Kaspi',
    price: 89990,
    rating: 4.9,
    reviewCount: 5000,
    image: 'https://resources.cdn-kaspi.kz/img/1.jpg',
    link: '/shop/p/smartfon-101010/',
  },
]

Deno.test('maps kaspi cards to KZT offers with absolute url', () => {
  const [first] = mapKaspi(SAMPLE)
  assertEquals(first.id, 'kaspi-101010')
  assertEquals(first.marketplaceId, 'kaspi')
  assertEquals(first.price, 89990)
  assertEquals(first.currency, 'KZT')
  assertEquals(first.rating, 4.9)
  assertEquals(first.reviewCount, 5000)
  assertEquals(first.productUrl, 'https://kaspi.kz/shop/p/smartfon-101010/')
  assertEquals(first.isB2B, false)
})

Deno.test('drops cards without an id', () => {
  assertEquals(mapKaspi([{ ...SAMPLE[0], id: '' }]).length, 0)
})
