import Link from 'next/link'
import dict from '@/data/dictionary.json'

export default function Home() {
  const wordCount = dict.length

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-primary mb-2 text-center">Apprend-Medumba</h1>
      <p className="text-lg text-foreground/70 mb-3 text-center">Apprenez la langue Medumba</p>
      <p className="text-sm text-foreground/50 mb-10 text-center max-w-md">
        Langue bantoue de l'ouest du Cameroun, parlée par environ 300 000 locuteurs.
        Cette application est conçue pour aider les enfants de la diaspora à découvrir et pratiquer leur langue maternelle.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
        <Link href="/alphabet" className="flex flex-col items-center p-6 rounded-xl bg-white border border-gray-200 hover:border-primary hover:shadow-md transition-all">
          <span className="text-3xl mb-2">🔤</span>
          <span className="font-semibold text-primary">Alphabet</span>
          <span className="text-sm text-foreground/60 mt-1">33 lettres</span>
        </Link>

        <Link href="/dictionnaire" className="flex flex-col items-center p-6 rounded-xl bg-white border border-gray-200 hover:border-primary hover:shadow-md transition-all">
          <span className="text-3xl mb-2">📖</span>
          <span className="font-semibold text-primary">Dictionnaire</span>
          <span className="text-sm text-foreground/60 mt-1">{wordCount.toLocaleString('fr')} mots</span>
        </Link>

        <Link href="/expressions" className="flex flex-col items-center p-6 rounded-xl bg-white border border-gray-200 hover:border-primary hover:shadow-md transition-all">
          <span className="text-3xl mb-2">💬</span>
          <span className="font-semibold text-primary">Expressions</span>
          <span className="text-sm text-foreground/60 mt-1">Phrases courantes</span>
        </Link>
      </div>
    </div>
  )
}
