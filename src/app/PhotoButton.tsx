import { useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { ScanLine } from 'lucide-react'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { supabase } from '@/shared/lib/supabase'
import { Spinner } from '@/shared/components/Spinner'

// Downscale to max 1024px and encode as JPEG to keep the upload small.
async function downscale(
  file: File,
  max = 1024,
): Promise<{ base64: string; mediaType: string; preview: string }> {
  const bitmap = await createImageBitmap(file)
  const scale = Math.min(1, max / Math.max(bitmap.width, bitmap.height))
  const width = Math.round(bitmap.width * scale)
  const height = Math.round(bitmap.height * scale)
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('canvas unavailable')
  ctx.drawImage(bitmap, 0, 0, width, height)
  bitmap.close()
  const dataUrl = canvas.toDataURL('image/jpeg', 0.85)
  return { base64: dataUrl.split(',')[1] ?? '', mediaType: 'image/jpeg', preview: dataUrl }
}

type PhotoButtonProps = {
  onQuery: (query: string) => void
  onError: () => void
  disabled?: boolean
}

export function PhotoButton({ onQuery, onError, disabled }: PhotoButtonProps) {
  const { t, lang } = useI18n()
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)

  async function handleFile(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (inputRef.current) inputRef.current.value = ''
    if (!file) return
    setBusy(true)
    try {
      const { base64, mediaType, preview: dataUrl } = await downscale(file)
      setPreview(dataUrl)
      const { data, error } = await supabase.functions.invoke('describe-image', {
        body: { imageBase64: base64, mediaType, lang },
      })
      const query = (data as { query?: string } | null)?.query
      if (error || !query) {
        onError()
        return
      }
      onQuery(query)
    } catch {
      onError()
    } finally {
      setBusy(false)
      setPreview(null)
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={disabled || busy}
        aria-label={t('photoButton')}
        title={t('photoButton')}
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sharp border border-line text-ink transition-colors hover:bg-ink/5 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {busy ? (
          <Spinner size={16} />
        ) : (
          <ScanLine size={18} strokeWidth={1.5} aria-hidden="true" />
        )}
      </button>
      {preview && (
        <img
          src={preview}
          alt=""
          className="h-10 w-10 shrink-0 rounded-sharp border border-line object-cover"
        />
      )}
    </>
  )
}
