'use client'

import { useState, useCallback } from 'react'
import type { Word } from '@/types'
import { searchWords } from '@/lib/search'
import SearchBar from './SearchBar'
import LetterFilter from './LetterFilter'
import WordCard from './WordCard'

const PAGE_SIZE = 50

interface DictionnaireClientProps {
  words: Word[]
  letters: string[]
}

export default function DictionnaireClient({ words, letters }: DictionnaireClientProps) {
  const [query, setQuery] = useState('')
  const [direction, setDirection] = useState<'medumba-to-fr' | 'fr-to-medumba'>('medumba-to-fr')
  const [activeLetter, setActiveLetter] = useState<string | undefined>()
  const [page, setPage] = useState(1)

  const handleSearch = useCallback((q: string, d: 'medumba-to-fr' | 'fr-to-medumba') => {
    setQuery(q)
    setDirection(d)
    setPage(1)
  }, [])

  function handleLetterSelect(letter?: string) {
    setActiveLetter(letter)
    setPage(1)
  }

  const filtered = searchWords(words, query, direction, activeLetter)
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, totalPages)
  const pageWords = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="flex flex-col gap-4">
      <SearchBar onSearch={handleSearch} resultCount={filtered.length} />
      <LetterFilter letters={letters} activeLetter={activeLetter} onSelect={handleLetterSelect} />

      <div className="flex flex-col gap-2">
        {pageWords.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Aucun résultat trouvé.</p>
        ) : (
          pageWords.map((word) => <WordCard key={word.slug + word.medumba} word={word} />)
        )}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:border-primary transition-colors"
          >
            ← Précédent
          </button>
          <span className="text-sm text-gray-500">
            Page {currentPage} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm disabled:opacity-40 hover:border-primary transition-colors"
          >
            Suivant →
          </button>
        </div>
      )}
    </div>
  )
}
