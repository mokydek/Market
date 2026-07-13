import type { Adapter } from './types.ts'
import { createMockAdapter } from './mock.ts'
import { wildberriesAdapter } from './wildberries.ts'

// Marketplace id to adapter. Real adapters replace the mock entries in the
// phases that follow; marketplaces without a real adapter yet serve
// deterministic mock data so the whole app stays demoable end to end.
const registry: Record<string, Adapter> = {
  wildberries: wildberriesAdapter,
  ozon: createMockAdapter('ozon', false),
  aliexpress: createMockAdapter('aliexpress', false),
  alibaba: createMockAdapter('alibaba', true),
  kaspi: createMockAdapter('kaspi', false),
}

export function getAdapter(marketplaceId: string): Adapter | null {
  return registry[marketplaceId] ?? null
}
