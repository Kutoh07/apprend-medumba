import { notFound } from 'next/navigation'
import Link from 'next/link'
import dictData from '@/data/dictionary.json'
import type { Word } from '@/types'
import AudioPlayer from '@/components/AudioPlayer'

const words = dictData as Word[]

export function generateStaticParams() {
  return words.map((w) => ({ slug: w.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const word = words.find((w) => w.slug === params.slug)
  if (!word) return {}
  return {
    title: `${word.medumba} — Apprend-Medumba`,
    description: `${word.medumba} : ${word.french}${word.category ? ` (${word.category})` : ''} — dictionnaire Medumba.`,
  }
}

export default function MotPage({ params }: { params: { slug: string } }) {
  const index = words.findIndex((w) => w.slug === params.slug)
  if (index === -1) notFound()

  const word = words[index]
  const prev = index > 0 ? words[index - 1] : null
  const next = index < words.length - 1 ? words[index + 1] : null

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <Link href="/dictionnaire" className="text-sm text-gray-400 hover:text-primary mb-6 inline-block">
        ← Dictionnaire
      </Link>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-medumba font-bold text-4xl text-foreground mb-1 break-words">{word.medumba}</h1>
            <p className="text-xl text-gray-600">{word.french}</p>
            {word.category && (
              <span className="inline-block mt-2 px-3 py-1 text-sm rounded-full bg-secondary/10 text-secondary font-medium">
                {word.category}
              </span>
            )}
          </div>
          <AudioPlayer hasAudio={word.hasAudio} audioPath={word.audioPath} size="lg" />
        </div>
      </div>

      {word.examples && word.examples.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm mb-6">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide mb-4">Exemples</h2>
          <ul className="flex flex-col gap-4">
            {word.examples.map((ex, i) => (
              <li key={i} className="border-l-2 border-primary/20 pl-4">
                <p className="font-medumba font-semibold text-foreground">{ex.medumba}</p>
                <p className="text-gray-500 text-sm">{ex.french}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="flex justify-between gap-4">
        {prev ? (
          <Link href={`/mot/${prev.slug}`} className="flex-1 p-3 rounded-xl border border-gray-200 hover:border-primary transition-colors text-left">
            <p className="text-xs text-gray-400 mb-1">← Précédent</p>
            <p className="font-medumba font-semibold text-sm truncate">{prev.medumba}</p>
          </Link>
        ) : <div className="flex-1" />}
        {next ? (
          <Link href={`/mot/${next.slug}`} className="flex-1 p-3 rounded-xl border border-gray-200 hover:border-primary transition-colors text-right">
            <p className="text-xs text-gray-400 mb-1">Suivant →</p>
            <p className="font-medumba font-semibold text-sm truncate">{next.medumba}</p>
          </Link>
        ) : <div className="flex-1" />}
      </div>
    </div>
  )
}
