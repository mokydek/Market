import { useState } from 'react'
import type { FormEvent } from 'react'
import { Search } from 'lucide-react'
import { useI18n } from '@/shared/i18n/I18nProvider'
import { Input } from '@/shared/components/Input'
import { Button } from '@/shared/components/Button'

type SearchBarProps = {
  onSearch: (query: string) => void
  disabled?: boolean
}

export function SearchBar({ onSearch, disabled }: SearchBarProps) {
  const { t } = useI18n()
  const [value, setValue] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const query = value.trim()
    if (query) onSearch(query)
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2">
      <Input
        type="search"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={t('searchPlaceholder')}
        aria-label={t('searchPlaceholder')}
        disabled={disabled}
      />
      <Button type="submit" disabled={disabled} className="shrink-0">
        <Search size={16} strokeWidth={1.5} className="mr-1.5" aria-hidden="true" />
        {t('searchButton')}
      </Button>
    </form>
  )
}
