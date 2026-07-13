import type { Adapter } from './types.ts'
import { createMockAdapter } from './mock.ts'

// Marketplace id to adapter. Real adapters replace the mock entries in the
// phases that follow; until then every marketplace serves deterministic mock
// data so the whole app is demoable end to end.
const registry: Record<string, Adapter> = {
  wildberries: createMockAdapter('wildberries', false),
  ozon: createMockAdapter('ozon', false),
  aliexpress: createMockAdapter('aliexpress', false),
  alibaba: createMockAdapter('alibaba', true),
  kaspi: createMockAdapter('kaspi', false),
}

export function getAdapter(marketplaceId: string): Adapter | null {
  return registry[marketplaceId] ?? null
}
