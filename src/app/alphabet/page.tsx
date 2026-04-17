import alphabetData from '@/data/alphabet.json'
import type { AlphabetLetter } from '@/types'
import AlphabetGrid from '@/components/AlphabetGrid'

export const metadata = {
  title: 'Alphabet — Apprend-Medumba',
  description: 'Les 33 lettres de l\'alphabet Medumba : voyelles et consonnes avec exemples et prononciation.',
}

export default function AlphabetPage() {
  const letters = alphabetData as AlphabetLetter[]
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-2">Alphabet Medumba</h1>
      <p className="text-sm text-gray-500 mb-8">33 lettres — cliquez sur une lettre pour voir un exemple.</p>
      <AlphabetGrid letters={letters} />
    </div>
  )
}
