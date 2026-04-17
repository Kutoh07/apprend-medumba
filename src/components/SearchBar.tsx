'use client'

import { useState, useEffect, useCallback } from 'react'

interface SearchBarProps {
  onSearch: (query: string, direction: 'medumba-to-fr' | 'fr-to-medumba') => void
  resultCount?: number
}

export default function SearchBar({ onSearch, resultCount }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [direction, setDirection] = useState<'medumba-to-fr' | 'fr-to-medumba'>('medumba-to-fr')

  const debouncedSearch = useCallback(
    debounce((q: string, d: 'medumba-to-fr' | 'fr-to-medumba') => {
      onSearch(q, d)
    }, 300),
    [onSearch]
  )

  useEffect(() => {
    debouncedSearch(query, direction)
  }, [query, direction, debouncedSearch])

  function toggleDirection() {
    setDirection((d) => (d === 'medumba-to-fr' ? 'fr-to-medumba' : 'medumba-to-fr'))
  }

  const placeholder = direction === 'medumba-to-fr' ? 'Rechercher en Medumba…' : 'Rechercher en français…'

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary text-sm"
          />
        </div>
        <button
          onClick={toggleDirection}
          className="px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors whitespace-nowrap"
          title="Inverser la direction de recherche"
        >
          {direction === 'medumba-to-fr' ? 'Med → FR' : 'FR → Med'}
        </button>
      </div>
      {resultCount !== undefined && query.length >= 2 && (
        <p className="text-xs text-gray-500 pl-1">{resultCount} résultat{resultCount !== 1 ? 's' : ''}</p>
      )}
    </div>
  )
}

function debounce<T extends (...args: Parameters<T>) => void>(fn: T, ms: number): T {
  let timer: ReturnType<typeof setTimeout>
  return ((...args: Parameters<T>) => {
    clearTimeout(timer)
    timer = setTimeout(() => fn(...args), ms)
  }) as T
}
