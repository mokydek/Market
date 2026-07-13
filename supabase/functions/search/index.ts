import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import type { Lang, Offer } from '../_shared/types.ts'
import { scoreOffers } from '../_shared/score.ts'
import { getAdapter } from '../_shared/adapters/registry.ts'
import { corsHeaders } from '../_shared/cors.ts'

const CACHE_TTL_MS = 6 * 60 * 60 * 1000 // 6 hours
const ADAPTER_TIMEOUT_MS = 8000

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// Reject after ms so one slow marketplace cannot hang the whole request.
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      },
    )
  })
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''

  try {
    const body = (await req.json()) as {
      query?: string
      lang?: Lang
      source?: string
    }
    const source = body.source === 'photo' ? 'photo' : 'text'
    const normalized = (body.query ?? '')
      .trim()
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .slice(0, 200) // cap length so a caller cannot bloat the cache
    if (!normalized) {
      return json({ offers: [], blockedMarketplaces: [] })
    }

    // Service role client bypasses RLS to read marketplaces and touch the cache.
    const admin = createClient(supabaseUrl, serviceKey)

    const { data: marketplaces, error: marketplacesError } = await admin
      .from('marketplaces')
      .select('id')
      .eq('enabled', true)

    if (marketplacesError) {
      console.error('search: failed to load marketplaces', marketplacesError.message)
      return json({ error: 'search_failed' }, 500)
    }

    const list = (marketplaces ?? []) as Array<{ id: string }>
    const blockedMarketplaces: string[] = []

    const settled = await Promise.allSettled(
      list.map((m) =>
        withTimeout(
          fetchForMarketplace(admin, m.id, normalized),
          ADAPTER_TIMEOUT_MS,
        ),
      ),
    )

    const offers: Offer[] = []
    settled.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        offers.push(...result.value)
      } else {
        blockedMarketplaces.push(list[index].id)
      }
    })

    const scored = scoreOffers(offers)

    // If a signed in user made the request, record it (RLS: own row only).
    const authHeader = req.headers.get('Authorization')
    if (authHeader) {
      const userClient = createClient(supabaseUrl, anonKey, {
        global: { headers: { Authorization: authHeader } },
      })
      const { data: userData } = await userClient.auth.getUser()
      if (userData.user) {
        await userClient.from('searches').insert({
          user_id: userData.user.id,
          query: normalized,
          source,
        })
      }
    }

    return json({ offers: scored, blockedMarketplaces })
  } catch (error) {
    console.error(
      'search: unhandled error',
      error instanceof Error ? error.message : error,
    )
    return json({ error: 'search_failed' }, 500)
  }
})

async function fetchForMarketplace(
  admin: ReturnType<typeof createClient>,
  marketplaceId: string,
  normalized: string,
): Promise<Offer[]> {
  const { data: cached } = await admin
    .from('search_cache')
    .select('results, fetched_at')
    .eq('query_normalized', normalized)
    .eq('marketplace_id', marketplaceId)
    .maybeSingle()

  if (
    cached &&
    Date.now() - new Date(cached.fetched_at as string).getTime() < CACHE_TTL_MS
  ) {
    return cached.results as Offer[]
  }

  const adapter = getAdapter(marketplaceId)
  if (!adapter) return []

  // A throw here marks this marketplace blocked. The whole call (cache read,
  // adapter, cache write) is time bounded by the caller's withTimeout.
  const offers = await adapter.search(normalized)

  await admin.from('search_cache').upsert(
    {
      query_normalized: normalized,
      marketplace_id: marketplaceId,
      results: offers,
      fetched_at: new Date().toISOString(),
    },
    { onConflict: 'query_normalized,marketplace_id' },
  )

  return offers
}
