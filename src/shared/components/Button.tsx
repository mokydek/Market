import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
}

const base =
  'inline-flex h-10 items-center justify-center rounded-sharp px-5 text-sm font-medium transition-colors focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-ink disabled:cursor-not-allowed disabled:opacity-40'

const variantClasses: Record<Variant, string> = {
  primary: 'bg-ink text-paper hover:bg-ink/85',
  secondary: 'border border-ink bg-paper text-ink hover:bg-ink/5',
}

export function Button({
  variant = 'primary',
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${base} ${variantClasses[variant]} ${className}`.trim()}
      {...props}
    />
  )
}
