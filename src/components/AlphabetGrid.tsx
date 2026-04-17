'use client'

import { useState } from 'react'
import type { AlphabetLetter } from '@/types'
import AudioPlayer from './AudioPlayer'

interface AlphabetGridProps {
  letters: AlphabetLetter[]
}

export default function AlphabetGrid({ letters }: AlphabetGridProps) {
  const [selected, setSelected] = useState<string | null>(null)

  const voyelles = letters.filter((l) => l.type === 'voyelle')
  const consonnes = letters.filter((l) => l.type === 'consonne')

  function renderGroup(group: AlphabetLetter[], title: string) {
    return (
      <div className="mb-8">
        <h2 className="text-lg font-semibold text-gray-500 uppercase tracking-wide mb-3">{title}</h2>
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {group.map((l) => {
            const isSelected = selected === l.letter
            return (
              <button
                key={l.letter}
                onClick={() => setSelected(isSelected ? null : l.letter)}
                className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all min-h-[64px] ${
                  isSelected
                    ? 'border-primary bg-primary text-white shadow-md'
                    : 'border-gray-200 bg-white text-foreground hover:border-primary/50 hover:shadow-sm'
                }`}
              >
                <span className="font-medumba font-semibold text-xl leading-none">{l.letter}</span>
              </button>
            )
          })}
        </div>

        {group.map((l) => {
          if (selected !== l.letter) return null
          return (
            <div key={`detail-${l.letter}`} className="mt-4 p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="font-medumba font-semibold text-2xl text-primary break-words">{l.example.medumba}</p>
                <p className="text-gray-600 break-words">{l.example.french}</p>
              </div>
              <AudioPlayer hasAudio={l.hasAudio} audioPath={l.audioPath} size="lg" />
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div>
      {renderGroup(voyelles, 'Voyelles')}
      {renderGroup(consonnes, 'Consonnes')}
    </div>
  )
}
