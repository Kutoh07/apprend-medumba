import type { Word, Expression } from '@/types'

const IPA_MAP: Record<string, string> = {
  'ɑ': 'a', 'ɛ': 'e', 'ə': 'e', 'ɔ': 'o', 'ʉ': 'u', 'ŋ': 'ng', 'ɲ': 'ny',
}

function normalize(text: string): string {
  let result = text.toLowerCase()
  for (const [ipa, ascii] of Object.entries(IPA_MAP)) {
    result = result.replaceAll(ipa, ascii)
  }
  return result
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function searchWords(
  words: Word[],
  query: string,
  direction: 'medumba-to-fr' | 'fr-to-medumba' = 'medumba-to-fr',
  letter?: string
): Word[] {
  let results = words

  if (letter) {
    results = results.filter((w) => w.letter === letter)
  }

  if (query.length >= 2) {
    const q = normalize(query)
    results = results.filter((w) => {
      const target = direction === 'medumba-to-fr' ? w.medumba : w.french
      return normalize(target).includes(q)
    })
  }

  return results
}

export function searchExpressions(
  expressions: Expression[],
  query: string,
  direction: 'medumba-to-fr' | 'fr-to-medumba' = 'medumba-to-fr'
): Expression[] {
  if (query.length < 2) return expressions
  const q = normalize(query)
  return expressions.filter((e) => {
    const target = direction === 'medumba-to-fr' ? e.medumba : e.french
    return normalize(target).includes(q)
  })
}
