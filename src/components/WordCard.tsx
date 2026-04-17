import Link from 'next/link'
import type { Word } from '@/types'
import AudioPlayer from './AudioPlayer'

interface WordCardProps {
  word: Word
}

export default function WordCard({ word }: WordCardProps) {
  return (
    <Link href={`/mot/${word.slug}`} className="block">
      <div className="flex items-center justify-between p-4 rounded-xl border border-gray-100 bg-white hover:border-primary/30 hover:shadow-sm transition-all">
        <div className="flex-1 min-w-0">
          <p className="font-medumba font-semibold text-lg text-foreground truncate">{word.medumba}</p>
          <p className="text-gray-600 text-sm truncate">{word.french}</p>
          {word.category && (
            <span className="inline-block mt-1 px-2 py-0.5 text-xs rounded-full bg-secondary/10 text-secondary font-medium">
              {word.category}
            </span>
          )}
        </div>
        <div className="ml-3 flex-shrink-0" onClick={(e) => e.preventDefault()}>
          <AudioPlayer hasAudio={word.hasAudio} audioPath={word.audioPath} size="sm" />
        </div>
      </div>
    </Link>
  )
}
