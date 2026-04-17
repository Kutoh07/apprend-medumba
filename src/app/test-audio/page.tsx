import AudioPlayer from '@/components/AudioPlayer'

export default function TestAudioPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-12 flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-primary">Test AudioPlayer</h1>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">hasAudio = true (test.mp3)</h2>
        <div className="flex gap-4 items-center">
          <AudioPlayer hasAudio size="sm" audioPath="/audio/test.mp3" />
          <AudioPlayer hasAudio size="md" audioPath="/audio/test.mp3" />
          <AudioPlayer hasAudio size="lg" audioPath="/audio/test.mp3" />
          <span className="text-sm text-gray-500">sm / md / lg</span>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">hasAudio = false</h2>
        <div className="flex gap-4 items-center">
          <AudioPlayer hasAudio={false} size="sm" />
          <AudioPlayer hasAudio={false} size="md" />
          <AudioPlayer hasAudio={false} size="lg" />
          <span className="text-sm text-gray-500">gris + tooltip au survol</span>
        </div>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Fichier manquant (erreur silencieuse)</h2>
        <div className="flex gap-4 items-center">
          <AudioPlayer hasAudio audioPath="/audio/inexistant.mp3" size="md" />
          <span className="text-sm text-gray-500">clic → aucune erreur visible</span>
        </div>
      </section>
    </div>
  )
}
