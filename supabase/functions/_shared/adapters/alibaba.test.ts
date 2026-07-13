import { assertEquals } from 'jsr:@std/assert@1'
import { mapAlibaba, parsePriceRange } from './alibaba.ts'
import type { AlibabaItem } from './alibaba.ts'

Deno.test('parsePriceRange extracts min and max', () => {
  assertEquals(parsePriceRange('$1.20 - $3.50'), [1.2, 3.5])
  assertEquals(parsePriceRange('2,00-5,00'), [2, 5])
  assertEquals(parsePriceRange('9.99'), [9.99, 9.99])
  assertEquals(parsePriceRange('no price'), [0, 0])
})

const SAMPLE: AlibabaItem[] = [
  {
    productId: 'AB777',
    title: 'Bulk Cable 100pcs',
    priceMin: 1.2,
    priceMax: 3.5,
    currency: 'USD',
    image: '//img.example/c.jpg',
    url: '/product-detail/x_777.html',
  },
]

Deno.test('maps alibaba as b2b with min price and range in raw', () => {
  const [first] = mapAlibaba(SAMPLE)
  assertEquals(first.id, 'alibaba-AB777')
  assertEquals(first.price, 1.2)
  assertEquals(first.isB2B, true)
  assertEquals(first.rating, null)
  assertEquals(first.raw, { priceMin: 1.2, priceMax: 3.5 })
  assertEquals(first.imageUrl, 'https://img.example/c.jpg')
  assertEquals(first.productUrl, 'https://www.alibaba.com/product-detail/x_777.html')
})
