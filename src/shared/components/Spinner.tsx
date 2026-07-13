import { Loader2 } from 'lucide-react'

type SpinnerProps = {
  size?: number
  className?: string
}

// Monochrome loading indicator. Decorative by default; pair it with visible
// loading text (t('loading')) where a status message is needed.
export function Spinner({ size = 20, className = '' }: SpinnerProps) {
  return (
    <Loader2
      size={size}
      strokeWidth={1.5}
      className={`animate-spin text-ink ${className}`.trim()}
      aria-hidden="true"
    />
  )
}
