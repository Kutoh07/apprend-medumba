import expressionsData from '@/data/expressions.json'
import type { Expression } from '@/types'
import AudioPlayer from '@/components/AudioPlayer'

export const metadata = {
  title: 'Expressions — Apprend-Medumba',
  description: 'Expressions courantes en Medumba : salutations, remerciements, présentations et plus.',
}

const CONTEXT_LABELS: Record<string, string> = {
  salutation: 'Salutations',
  remerciement: 'Remerciements',
  présentation: 'Présentations',
  amour: 'Amour',
  accouchement: 'Accouchement',
}

export default function ExpressionsPage() {
  const expressions = expressionsData as Expression[]

  const grouped = new Map<string, Expression[]>()
  for (const expr of expressions) {
    const key = expr.context ?? 'autres'
    if (!grouped.has(key)) grouped.set(key, [])
    grouped.get(key)!.push(expr)
  }

  const orderedKeys = [
    ...Object.keys(CONTEXT_LABELS).filter((k) => grouped.has(k)),
    ...Array.from(grouped.keys()).filter((k) => !CONTEXT_LABELS[k]),
  ]

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-primary mb-2">Expressions</h1>
      <p className="text-sm text-gray-500 mb-8">{expressions.length} expressions courantes</p>

      <div className="flex flex-col gap-10">
        {orderedKeys.map((key) => (
          <section key={key}>
            <h2 className="text-base font-semibold text-gray-500 uppercase tracking-wide mb-4">
              {CONTEXT_LABELS[key] ?? key.charAt(0).toUpperCase() + key.slice(1)}
            </h2>
            <div className="flex flex-col gap-3">
              {grouped.get(key)!.map((expr) => (
                <div
                  key={expr.slug}
                  className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 hover:border-primary/30 transition-colors"
                >
                  <div>
                    <p className="font-medumba font-semibold text-foreground">{expr.medumba}</p>
                    <p className="text-gray-500 text-sm">{expr.french}</p>
                  </div>
                  <AudioPlayer hasAudio={expr.hasAudio} audioPath={expr.audioPath} size="sm" />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
