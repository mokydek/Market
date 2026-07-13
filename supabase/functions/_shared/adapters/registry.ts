import type { Adapter } from './types.ts'
import { wildberriesAdapter } from './wildberries.ts'
import { ozonAdapter } from './ozon.ts'
import { aliexpressAdapter } from './aliexpress.ts'
import { alibabaAdapter } from './alibaba.ts'
import { kaspiAdapter } from './kaspi.ts'

// Marketplace id to adapter. Real adapters replace the mock entries in the
// phases that follow; marketplaces without a real adapter yet serve
// deterministic mock data so the whole app stays demoable end to end.
const registry: Record<string, Adapter> = {
  wildberries: wildberriesAdapter,
  ozon: ozonAdapter,
  aliexpress: aliexpressAdapter,
  alibaba: alibabaAdapter,
  kaspi: kaspiAdapter,
}

export function getAdapter(marketplaceId: string): Adapter | null {
  return registry[marketplaceId] ?? null
}
