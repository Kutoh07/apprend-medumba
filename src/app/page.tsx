import Link from 'next/link'
import Image from 'next/image'
import dict from '@/data/dictionary.json'

export default function Home() {
  const wordCount = dict.length

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero */}
      <div className="relative flex-1 flex flex-col items-center justify-center p-6 min-h-screen">
        <Image
          src="/images/accueil-bg.png"
          alt="Grand-mère et enfants apprenant le Medumba"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/50" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center">
          <h1 className="text-4xl font-bold text-white mb-2 text-center drop-shadow-lg">Apprend-Medumba</h1>
          <p className="text-lg text-white/90 mb-3 text-center drop-shadow">Apprenez la langue Medumba</p>
          <p className="text-sm text-white/75 mb-10 text-center max-w-md drop-shadow">
            Langue bantou de l'ouest du Cameroun originaire du département du NDE, parlée par environ 300 000 locuteurs.
            Cette application permet à toute personne souhaitant découvrir ou approfondir le Medumba de l'apprendre à son rythme, avec la prononciation authentique de chaque mot.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl">
            <Link href="/alphabet" className="flex flex-col items-center p-6 rounded-xl bg-white/90 backdrop-blur-sm border border-white/20 hover:bg-white hover:shadow-lg transition-all">
              <span className="text-3xl mb-2">🔤</span>
              <span className="font-semibold text-primary">Alphabet</span>
              <span className="text-sm text-foreground/60 mt-1">33 lettres</span>
            </Link>

            <Link href="/dictionnaire" className="flex flex-col items-center p-6 rounded-xl bg-white/90 backdrop-blur-sm border border-white/20 hover:bg-white hover:shadow-lg transition-all">
              <span className="text-3xl mb-2">📖</span>
              <span className="font-semibold text-primary">Dictionnaire</span>
              <span className="text-sm text-foreground/60 mt-1">{wordCount.toLocaleString('fr')} mots</span>
            </Link>

            <Link href="/expressions" className="flex flex-col items-center p-6 rounded-xl bg-white/90 backdrop-blur-sm border border-white/20 hover:bg-white hover:shadow-lg transition-all">
              <span className="text-3xl mb-2">💬</span>
              <span className="font-semibold text-primary">Expressions</span>
              <span className="text-sm text-foreground/60 mt-1">Phrases courantes</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
