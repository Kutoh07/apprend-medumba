const IPA_MAP: Record<string, string> = {
  'ɑ': 'a', 'ɛ': 'e', 'ə': 'e', 'ɔ': 'o', 'ʉ': 'u', 'ŋ': 'ng',
}

export function slugify(text: string): string {
  let result = text.toLowerCase()
  for (const [ipa, ascii] of Object.entries(IPA_MAP)) {
    result = result.replaceAll(ipa, ascii)
  }
  return result
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/'/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
