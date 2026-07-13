import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import type { Lang } from '../_shared/types.ts'
import { corsHeaders } from '../_shared/cors.ts'

const LANG_NAMES: Record<Lang, string> = {
  ru: 'Russian',
  en: 'English',
  kk: 'Kazakh',
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  })
}

// Turns a product photo into ONE short marketplace search query using a vision
// model. The API key comes from the VISION_API_KEY secret (never hardcoded).
// Implemented for Anthropic Claude; swap the endpoint/body for another provider
// if VISION_API_KEY belongs to a different service.
Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const apiKey = Deno.env.get('VISION_API_KEY')
  if (!apiKey) {
    // Not configured: photo search is optional, text search still works.
    return json({ error: 'vision_not_configured' }, 503)
  }

  // Require a signed in user so this paid vision endpoint cannot be abused
  // anonymously by anyone holding the public anon key.
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return json({ error: 'unauthorized' }, 401)
  const userClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: authHeader } } },
  )
  const { data: userData } = await userClient.auth.getUser()
  if (!userData.user) return json({ error: 'unauthorized' }, 401)

  try {
    const body = (await req.json()) as {
      imageBase64?: string
      mediaType?: string
      lang?: Lang
    }
    const image = body.imageBase64 ?? ''
    if (!image) return json({ error: 'no_image' }, 400)
    if (image.length > 7_000_000) return json({ error: 'image_too_large' }, 413)

    const langName = LANG_NAMES[body.lang ?? 'ru'] ?? 'Russian'
    const mediaType = body.mediaType ?? 'image/jpeg'
    const prompt =
      `Look at this product image and reply with ONLY a short product search ` +
      `query of 2 to 5 words in ${langName}, describing the main product so it ` +
      `can be searched on a marketplace. No punctuation and no extra words.`

    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 32,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'image',
                source: { type: 'base64', media_type: mediaType, data: image },
              },
              { type: 'text', text: prompt },
            ],
          },
        ],
      }),
    })

    if (!res.ok) {
      console.error('describe-image: vision api status', res.status)
      return json({ error: 'vision_failed' }, 502)
    }

    const data = (await res.json()) as {
      content?: Array<{ type: string; text?: string }>
    }
    const text = data.content?.find((c) => c.type === 'text')?.text ?? ''
    const query = text
      .replace(/["'\n]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, 100)

    if (!query) return json({ error: 'empty_query' }, 502)
    return json({ query })
  } catch (error) {
    console.error(
      'describe-image error',
      error instanceof Error ? error.message : error,
    )
    return json({ error: 'vision_failed' }, 500)
  }
})
