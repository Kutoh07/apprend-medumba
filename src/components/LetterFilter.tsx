'use client'

interface LetterFilterProps {
  letters: string[]
  activeLetter?: string
  onSelect: (letter?: string) => void
}

export default function LetterFilter({ letters, activeLetter, onSelect }: LetterFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect(undefined)}
        className={`flex-shrink-0 px-3 py-2 min-h-[44px] rounded-lg text-sm font-medium transition-colors ${
          !activeLetter
            ? 'bg-primary text-white'
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
      >
        Tout
      </button>
      {letters.map((letter) => (
        <button
          key={letter}
          onClick={() => onSelect(letter)}
          className={`flex-shrink-0 px-3 py-2 min-h-[44px] rounded-lg text-sm font-medumba font-medium transition-colors min-w-[44px] ${
            activeLetter === letter
              ? 'bg-primary text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {letter}
        </button>
      ))}
    </div>
  )
}
