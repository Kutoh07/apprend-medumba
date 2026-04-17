import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Types (mirrors src/types/index.ts) ---
interface Word {
  slug: string;
  medumba: string;
  french: string;
  category?: string;
  examples?: { medumba: string; french: string }[];
  audioPath?: string;
  hasAudio: boolean;
  letter: string;
}

interface AlphabetLetter {
  letter: string;
  type: 'voyelle' | 'consonne';
  example: { medumba: string; french: string };
  audioPath?: string;
  hasAudio: boolean;
}

interface Expression {
  slug: string;
  medumba: string;
  french: string;
  context?: string;
  audioPath?: string;
  hasAudio: boolean;
}

// --- Constants ---
const BASE_URL = 'https://kemelang.com';
const DELAY_MS = 500;
const ROOT = path.join(__dirname, '..');

// --- Helpers ---
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchPage(url: string): Promise<cheerio.CheerioAPI | null> {
  try {
    const res = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Accept': 'text/html,application/xhtml+xml',
        'Accept-Language': 'fr-FR,fr;q=0.9',
      },
      timeout: 15000,
    });
    return cheerio.load(res.data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error(`\n  ❌ ${url} — ${msg}`);
    return null;
  }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    // Remove combining diacritics (tone marks: ̀ ́ ̂ ̌ etc.)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Map IPA vowels
    .replace(/[ɑα]/g, 'a')
    .replace(/[ɛ]/g, 'e')
    .replace(/[ə]/g, 'e')
    .replace(/[ɔ]/g, 'o')
    .replace(/[ʉ]/g, 'u')
    // Map IPA consonants
    .replace(/[ŋ]/g, 'ng')
    .replace(/[ɲ]/g, 'ny')
    // Remove apostrophes/glottal stop
    .replace(/['\u2019\u02bc\u0027]/g, '')
    // Keep only alphanumeric + spaces
    .replace(/[^a-z0-9\s]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

function getFirstLetter(medumba: string): string {
  const word = medumba.toLowerCase().trim();
  if (word.startsWith('gh')) return 'gh';
  if (word.startsWith('ny')) return 'ny';
  if (word.startsWith('sh')) return 'sh';
  if (word.startsWith('ts')) return 'ts';
  // Use the first actual unicode character
  const first = [...word][0] ?? '';
  return first;
}

// --- Scraper: Word list pages ---
async function scrapeWordUrls(): Promise<string[]> {
  const allUrls = new Set<string>();

  // Detect actual page count on first load
  let maxPage = 17;
  for (let page = 1; page <= maxPage; page++) {
    const url =
      page === 1
        ? `${BASE_URL}/medumba/transliterations/`
        : `${BASE_URL}/medumba/transliterations/?page=${page}`;

    process.stdout.write(`\r  📄 List page ${page}/${maxPage}...  `);
    const $ = await fetchPage(url);
    if (!$) { await sleep(DELAY_MS); continue; }

    // Update maxPage from pagination links on first page
    if (page === 1) {
      $('a[href*="?page="]').each((_, el) => {
        const m = ($(el).attr('href') ?? '').match(/page=(\d+)/);
        if (m) maxPage = Math.max(maxPage, parseInt(m[1]));
      });
    }

    $('a[href]').each((_, el) => {
      const href = $(el).attr('href') ?? '';
      const full = href.startsWith('http') ? href : `${BASE_URL}${href}`;
      if (
        /kemelang\.com\/medumba\/[^/]+\/$/.test(full) &&
        !full.includes('transliterations') &&
        !full.includes('accounts') &&
        !full.includes('expressions') &&
        !full.endsWith('/medumba/')
      ) {
        allUrls.add(full);
      }
    });

    await sleep(DELAY_MS);
  }

  return [...allUrls];
}

// --- Scraper: Word detail ---
async function scrapeWordDetail(url: string): Promise<Word | null> {
  const $ = await fetchPage(url);
  if (!$) return null;

  const medumba = $('#word-definitions .word-header').first().text().trim();
  if (!medumba) return null;

  let french = '';
  let category: string | undefined;
  const examples: { medumba: string; french: string }[] = [];

  // Parse definitions — each <dd> has one definition
  $('#word-definitions dd').each((idx, el) => {
    const $el = $(el);
    const iTag = $el.find('i.lowercase').first();

    let rawCat = '';
    let rawFrench = '';

    if (iTag.length) {
      rawCat = iTag.text().replace(/;$/, '').trim();
      // Text content of parent minus the <i> text and number prefix
      const fullText = $el.text().replace(/^\d+\.\s*/, '').trim();
      rawFrench = fullText.replace(iTag.text(), '').trim();
    } else {
      rawFrench = $el.text().replace(/^\d+\.\s*/, '').trim();
    }

    if (!rawFrench) return;

    if (idx === 0) {
      french = rawFrench;
      if (rawCat) category = rawCat.toLowerCase();
    }
  });

  if (!french) return null;

  const slug = slugify(medumba);
  if (!slug) return null;

  const word: Word = {
    slug,
    medumba,
    french,
    hasAudio: false,
    letter: getFirstLetter(medumba),
  };
  if (category) word.category = category;
  if (examples.length > 0) word.examples = examples;

  return word;
}

// --- Scraper: Expressions ---
async function scrapeExpressions(): Promise<Expression[]> {
  const expressions: Expression[] = [];

  console.log('\n\n💬 Fetching expressions list...');
  const $ = await fetchPage(`${BASE_URL}/medumba/expressions/`);
  if (!$) return [];

  const items: { medumba: string; context: string | undefined; detailUrl: string }[] = [];

  $('dl#phrase-list dd').each((_, el) => {
    const medumba = $(el).attr('data-content') ?? '';
    const context = $(el).attr('data-context') ?? '';
    const relUrl = $(el).find('a[href*="/expressions/"]').attr('href') ?? '';
    if (medumba && relUrl) {
      const fullUrl = relUrl.startsWith('http') ? relUrl : `${BASE_URL}${relUrl}`;
      items.push({
        medumba,
        context: context && context !== 'None' ? context : undefined,
        detailUrl: fullUrl,
      });
    }
  });

  console.log(`  Found ${items.length} expressions, fetching French translations...`);
  await sleep(DELAY_MS);

  for (let i = 0; i < items.length; i++) {
    const { medumba, context, detailUrl } = items[i];
    process.stdout.write(`\r  Expression ${i + 1}/${items.length}  `);

    const $d = await fetchPage(detailUrl);
    if (!$d) { await sleep(DELAY_MS); continue; }

    const french =
      $d('dl#phrase-list dd[data-lang="francais"]').first().attr('data-content') ?? '';

    if (!french) { await sleep(DELAY_MS); continue; }

    const slug = slugify(medumba);
    if (!slug) { await sleep(DELAY_MS); continue; }

    const expr: Expression = { slug, medumba, french, hasAudio: false };
    if (context) expr.context = context;
    expressions.push(expr);

    await sleep(DELAY_MS);
  }

  return expressions;
}

// --- Alphabet (from CLAUDE.md — authoritative source) ---
const ALPHABET_DATA: AlphabetLetter[] = [
  // Voyelles
  { letter: 'a',  type: 'voyelle',  example: { medumba: 'bà',       french: 'vélo' },          hasAudio: false },
  { letter: 'ɑ',  type: 'voyelle',  example: { medumba: 'bɑ',       french: 'folie' },          hasAudio: false },
  { letter: 'ə',  type: 'voyelle',  example: { medumba: 'bə',       french: 'être' },           hasAudio: false },
  { letter: 'e',  type: 'voyelle',  example: { medumba: "le'njè",   french: 'jour' },           hasAudio: false },
  { letter: 'ɛ',  type: 'voyelle',  example: { medumba: 'têd',      french: 'milieu' },         hasAudio: false },
  { letter: 'i',  type: 'voyelle',  example: { medumba: 'bì',       french: 'couteau' },        hasAudio: false },
  { letter: 'o',  type: 'voyelle',  example: { medumba: 'bo',       french: 'ils, elles' },     hasAudio: false },
  { letter: 'ɔ',  type: 'voyelle',  example: { medumba: 'tɔ',       french: 'vote' },           hasAudio: false },
  { letter: 'u',  type: 'voyelle',  example: { medumba: 'tù',       french: 'tête' },           hasAudio: false },
  { letter: 'ʉ',  type: 'voyelle',  example: { medumba: 'vʉ',       french: 'mort' },           hasAudio: false },
  // Consonnes
  { letter: 'b',  type: 'consonne', example: { medumba: 'bô',       french: 'avec, plus' },     hasAudio: false },
  { letter: 'c',  type: 'consonne', example: { medumba: 'cɔ',       french: 'histoire' },       hasAudio: false },
  { letter: 'd',  type: 'consonne', example: { medumba: 'dùm',      french: 'saison sèche' },   hasAudio: false },
  { letter: 'f',  type: 'consonne', example: { medumba: 'fà',       french: 'accident' },       hasAudio: false },
  { letter: 'gh', type: 'consonne', example: { medumba: 'ghù',      french: 'fiançailles' },    hasAudio: false },
  { letter: 'h',  type: 'consonne', example: { medumba: 'Hòg',      french: "nom d'un village" }, hasAudio: false },
  { letter: 'j',  type: 'consonne', example: { medumba: 'Jè',       french: "nom d'un village" }, hasAudio: false },
  { letter: 'k',  type: 'consonne', example: { medumba: 'kènà',     french: 'arachide' },       hasAudio: false },
  { letter: 'l',  type: 'consonne', example: { medumba: 'lò',       french: 'paresse' },        hasAudio: false },
  { letter: 'm',  type: 'consonne', example: { medumba: 'men',      french: "l'enfant" },       hasAudio: false },
  { letter: 'n',  type: 'consonne', example: { medumba: 'nèndò',    french: 'herbe' },          hasAudio: false },
  { letter: 'ŋ',  type: 'consonne', example: { medumba: 'ŋcbə',     french: 'coller' },         hasAudio: false },
  { letter: 'ny', type: 'consonne', example: { medumba: 'nyu',      french: 'serpent' },        hasAudio: false },
  { letter: 's',  type: 'consonne', example: { medumba: "sè'e",     french: 'viens' },          hasAudio: false },
  { letter: 'sh', type: 'consonne', example: { medumba: 'shune',    french: 'amitié' },         hasAudio: false },
  { letter: 't',  type: 'consonne', example: { medumba: 'tɑ',       french: 'père' },           hasAudio: false },
  { letter: 'ts', type: 'consonne', example: { medumba: 'tsetòn',   french: 'grillon' },        hasAudio: false },
  { letter: 'v',  type: 'consonne', example: { medumba: 'vʉ',       french: 'mort' },           hasAudio: false },
  { letter: 'w',  type: 'consonne', example: { medumba: 'wud',      french: 'corps humain' },   hasAudio: false },
  { letter: 'y',  type: 'consonne', example: { medumba: 'yu',       french: 'pour toi' },       hasAudio: false },
  { letter: 'z',  type: 'consonne', example: { medumba: 'zi',       french: 'dorsière' },       hasAudio: false },
  { letter: "'",  type: 'consonne', example: { medumba: "cua'a",    french: 'coup de glotte' }, hasAudio: false },
];

// --- Main ---
async function main() {
  console.log('🚀 Scraping kemelang.com/medumba — démarrage\n');

  // 1. Collect word URLs
  console.log('📋 Collecte des URLs de mots...');
  const wordUrls = await scrapeWordUrls();
  console.log(`\n  → ${wordUrls.length} mots trouvés\n`);

  // 2. Scrape each word detail
  const words: Word[] = [];
  const failedWords: string[] = [];

  console.log('📖 Scraping des pages mots...');
  for (let i = 0; i < wordUrls.length; i++) {
    process.stdout.write(
      `\r  ${i + 1}/${wordUrls.length} — ✅ ${words.length} | ❌ ${failedWords.length}`
    );
    const word = await scrapeWordDetail(wordUrls[i]);
    if (word) {
      words.push(word);
    } else {
      failedWords.push(wordUrls[i]);
    }
    await sleep(DELAY_MS);
  }

  console.log(`\n  → ${words.length} mots extraits, ${failedWords.length} échecs`);

  if (failedWords.length > 0) {
    const failLog = path.join(ROOT, 'scripts/failed-words.txt');
    fs.writeFileSync(failLog, failedWords.join('\n'));
    console.log(`  ⚠️  URLs en échec sauvegardées dans scripts/failed-words.txt`);
  }

  // 3. Scrape expressions
  const expressions = await scrapeExpressions();
  console.log(`\n  → ${expressions.length} expressions extraites`);

  // 4. Write JSON files
  console.log('\n💾 Écriture des fichiers JSON...');

  fs.writeFileSync(
    path.join(ROOT, 'src/data/dictionary.json'),
    JSON.stringify(words, null, 2)
  );
  console.log(`  ✅ src/data/dictionary.json — ${words.length} mots`);

  fs.writeFileSync(
    path.join(ROOT, 'src/data/expressions.json'),
    JSON.stringify(expressions, null, 2)
  );
  console.log(`  ✅ src/data/expressions.json — ${expressions.length} expressions`);

  fs.writeFileSync(
    path.join(ROOT, 'src/data/alphabet.json'),
    JSON.stringify(ALPHABET_DATA, null, 2)
  );
  console.log(`  ✅ src/data/alphabet.json — ${ALPHABET_DATA.length} lettres`);

  console.log('\n🎉 Scraping terminé !');
}

main().catch(console.error);
