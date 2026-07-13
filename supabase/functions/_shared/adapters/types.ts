import type { Offer } from '../types.ts'

// Every marketplace adapter implements this. A failing or blocked adapter
// should throw; the search function turns a throw into a reported "blocked"
// marketplace rather than failing the whole request.
export interface Adapter {
  search(query: string): Promise<Offer[]>
}
