import dictData from '@/data/dictionary.json'
import alphabetData from '@/data/alphabet.json'
import type { Word } from '@/types'
import DictionnaireClient from '@/components/DictionnaireClient'

export const metadata = {
  title: 'Dictionnaire — Apprend-Medumba',
  description: 'Plus de 2 400 mots Medumba avec traduction française. Recherche par lettre ou par mot.',
}

export default function DictionnairePage() {
  const words = dictData as Word[]
  const alphabetLetters = alphabetData.map((l) => l.letter)
  const wordLetters = new Set(words.map((w) => w.letter))
  const letters = alphabetLetters.filter((l) => wordLetters.has(l))

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-2">Dictionnaire</h1>
      <p className="text-sm text-gray-500 mb-6">{words.length.toLocaleString('fr')} mots disponibles</p>
      <DictionnaireClient words={words} letters={letters} />
    </div>
  )
}
