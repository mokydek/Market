import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement>

const base =
  'h-10 w-full rounded-sharp border border-line bg-paper px-3 text-sm text-ink placeholder:text-ink/40 transition-colors focus:border-ink focus:outline-none disabled:cursor-not-allowed disabled:opacity-40'

export function Input({ className = '', ...props }: InputProps) {
  return <input className={`${base} ${className}`.trim()} {...props} />
}
