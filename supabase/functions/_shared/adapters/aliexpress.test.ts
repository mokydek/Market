import { assertEquals } from 'jsr:@std/assert@1'
import { mapAliexpress } from './aliexpress.ts'
import type { AliItem } from './aliexpress.ts'

const SAMPLE: AliItem[] = [
  {
    productId: '100500',
    title: 'Wireless Earbuds',
    price: 12.5,
    currency: 'USD',
    rating: 4.6,
    reviewCount: 900,
    image: '//ae01.example/img.jpg',
  },
]

Deno.test('maps aliexpress items with protocol relative image and item url', () => {
  const [first] = mapAliexpress(SAMPLE)
  assertEquals(first.id, 'aliexpress-100500')
  assertEquals(first.title, 'Wireless Earbuds')
  assertEquals(first.price, 12.5)
  assertEquals(first.currency, 'USD')
  assertEquals(first.imageUrl, 'https://ae01.example/img.jpg')
  assertEquals(first.productUrl, 'https://www.aliexpress.com/item/100500.html')
  assertEquals(first.isB2B, false)
})

Deno.test('drops items without a product id', () => {
  const offers = mapAliexpress([{ ...SAMPLE[0], productId: '' }])
  assertEquals(offers.length, 0)
})
