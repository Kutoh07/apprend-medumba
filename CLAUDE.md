# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---
---

# Apprend-Medumba — Spécifications Projet

Application web d'apprentissage de la langue Medumba (langue bantoue, ouest Cameroun, ~300 000 locuteurs).
Objectif : permettre aux enfants de la diaspora d'apprendre le Medumba avec support audio.

## Stack technique

- **Framework** : Next.js 14+ (App Router)
- **Langage** : TypeScript
- **Styling** : Tailwind CSS
- **Données** : JSON statique (MVP), Supabase PostgreSQL (Phase 2)
- **Audio** : MP3 statiques dans /public/audio/ (MVP), Supabase Storage (Phase 2)
- **Hébergement** : Vercel (plan Hobby gratuit)
- **Package manager** : pnpm
- **Node.js** : v20+

## Structure des dossiers

```
apprend-medumba/
├── public/
│   ├── audio/
│   │   ├── alphabet/          # Audio pour chaque lettre (a.mp3, b.mp3...)
│   │   ├── words/             # Audio pour chaque mot (slug.mp3)
│   │   └── expressions/       # Audio pour les expressions
│   └── images/                # Logo, favicon, illustrations
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Layout global (nav, footer)
│   │   ├── page.tsx           # Page d'accueil
│   │   ├── alphabet/
│   │   │   └── page.tsx       # Page alphabet + audio
│   │   ├── dictionnaire/
│   │   │   └── page.tsx       # Recherche + liste des mots
│   │   ├── mot/[slug]/
│   │   │   └── page.tsx       # Détail d'un mot
│   │   └── expressions/
│   │       └── page.tsx       # Liste des expressions
│   ├── components/
│   │   ├── AudioPlayer.tsx    # Bouton lecture audio réutilisable
│   │   ├── SearchBar.tsx      # Barre de recherche avec autocomplétion
│   │   ├── WordCard.tsx       # Carte mot (mot + trad + bouton audio)
│   │   ├── AlphabetGrid.tsx   # Grille des lettres cliquables
│   │   ├── LetterFilter.tsx   # Navigation par lettre
│   │   └── Navbar.tsx         # Navigation principale
│   ├── data/
│   │   ├── dictionary.json    # Dictionnaire complet (1855 mots)
│   │   ├── alphabet.json      # 33 lettres + exemples + audio
│   │   └── expressions.json   # Expressions courantes
│   ├── lib/
│   │   ├── search.ts          # Logique de recherche/filtre
│   │   ├── slugify.ts         # Génération de slugs pour les mots
│   │   └── supabase.ts        # Client Supabase (préparé mais inactif en Phase 1)
│   └── types/
│       └── index.ts           # Types TypeScript
├── scripts/
│   └── scrape-kemelang.ts     # Script de scraping du dictionnaire
├── tailwind.config.ts
├── next.config.js
├── tsconfig.json
└── package.json
```

## Types TypeScript

```typescript
// src/types/index.ts

export interface Word {
  slug: string;              // Identifiant unique (URL-safe)
  medumba: string;           // Mot en Medumba (ex: "bà")
  french: string;            // Traduction française (ex: "vélo")
  category?: string;         // Catégorie (ex: "nom", "verbe", "adjectif")
  examples?: {
    medumba: string;         // Phrase exemple en Medumba
    french: string;          // Traduction de l'exemple
  }[];
  audioPath?: string;        // Chemin vers le fichier audio (ex: "/audio/words/ba.mp3")
  hasAudio: boolean;         // true si l'audio est disponible
  letter: string;            // Première lettre de l'alphabet Medumba (pour le filtre)
}

export interface AlphabetLetter {
  letter: string;            // La lettre (ex: "a", "gh", "ŋ")
  type: "voyelle" | "consonne";
  example: {
    medumba: string;         // Mot exemple
    french: string;          // Traduction
  };
  audioPath?: string;        // Audio de la lettre seule
  hasAudio: boolean;
}

export interface Expression {
  slug: string;
  medumba: string;
  french: string;
  context?: string;          // Contexte d'utilisation (ex: "salutation", "marché")
  audioPath?: string;
  hasAudio: boolean;
}
```

## Alphabet Medumba (33 lettres)

### Voyelles (10)

| Lettre | Exemple Medumba | Traduction |
|--------|----------------|------------|
| a | bà | vélo |
| ɑ | bɑ | folie |
| ə | bə | être |
| e | le'njè | jour |
| ɛ | têd | milieu |
| i | bì | couteau |
| o | bo | ils, elles |
| ɔ | tɔ | vote |
| u | tù | tête |
| ʉ | vʉ | mort |

### Consonnes (23)

| Lettre | Exemple Medumba | Traduction |
|--------|----------------|------------|
| b | bô | avec, plus |
| d | dùm | saison sèche |
| f | fà | accident |
| g | (voir gh) | |
| gh | ghù | fiançailles |
| h | Hòg | nom d'un village |
| j | Jè | nom d'un village |
| k | kènà | arachide |
| l | lò | paresse |
| m | men | l'enfant |
| n | nèndò | herbe |
| ŋ | ŋcbə | coller |
| ny | nyu | serpent |
| s | sè'e | viens |
| sh | shune | amitié |
| t | tɑ | pere |
| ts | tsetòn | grillon |
| v | vʉ | mort |
| w | wud | corps humain |
| y | yu | pour toi |
| z | zi | dorsière |
| ' | (coup de glotte) | utilisé dans certains mots |
| c | cɔ | histoire |

## Sources de données à scraper

| Page | URL |
|------|-----|
| Racine dictionnaire | https://kemelang.com/medumba/ |
| Liste vocabulaire | https://kemelang.com/medumba/transliterations/ |
| Expressions | https://kemelang.com/medumba/expressions/ |
| Alphabet | https://kemelang.com/dictionary/lessons/medumba/alphabet-medumba/ |
| Détail d'un mot | https://kemelang.com/medumba/{mot}/ |

## Charte graphique

| Élément | Valeur |
|---------|--------|
| Couleur primaire | #1B4F72 (bleu foncé) |
| Couleur secondaire | #F39C12 (or/jaune) |
| Couleur accent | #27AE60 (vert) |
| Fond | #FAFAFA |
| Texte | #333333 |
| Police principale | Inter (Google Fonts) |
| Police Medumba | Noto Sans (supporte ɑ, ɛ, ɔ, ŋ, ʉ, ə) |

## Principes UX

- Mobile-first : 80%+ des utilisateurs seront sur mobile
- Minimaliste : pas de surcharge visuelle, focus sur le contenu
- Feedback audio immédiat : clic → son sans délai
- Accessibilité : contrastes suffisants, tailles tactiles 44px minimum
- Offline-friendly : JSON statique, fonctionne avec connexion lente

## Spécifications audio

| Paramètre | Valeur |
|-----------|--------|
| Format | MP3 |
| Bitrate | 128 kbps |
| Fréquence | 44.1 kHz |
| Durée | 1-5 secondes par mot |
| Nommage | {slug}.mp3 |

## Spécifications des composants

### AudioPlayer.tsx
- Props : `audioPath?: string`, `hasAudio: boolean`, `size?: "sm" | "md" | "lg"`
- Si hasAudio = true : bouton haut-parleur, clic joue le MP3 via `new Audio()`
- Si hasAudio = false : bouton grisé + tooltip "audio bientôt disponible"
- Icône change pendant la lecture (speaker → playing)

### SearchBar.tsx
- Input avec icône loupe
- Recherche dès 2 caractères tapés, debounce 300ms
- Toggle direction : Medumba → FR ou FR → Medumba
- Recherche insensible aux accents et aux tons ("ba", "bà", "bá" matchent tous)
- Afficher le nombre de résultats

### WordCard.tsx
- Mot Medumba (police Noto Sans, semi-bold, plus grande)
- Traduction française
- Badge catégorie grammaticale (discret)
- Bouton AudioPlayer (taille sm)
- Au clic sur la carte : navigue vers /mot/[slug]

### LetterFilter.tsx
- Barre horizontale scrollable
- Un bouton par lettre de l'alphabet Medumba
- Bouton "Tout" pour réinitialiser le filtre
- Lettre active en surbrillance

### AlphabetGrid.tsx
- Grille de cartes : chaque lettre cliquable
- Séparation visuelle voyelles / consonnes
- Au clic : affiche mot exemple + traduction + bouton audio

### Navbar.tsx
- Logo "Apprend-Medumba" à gauche
- Liens : Accueil, Alphabet, Dictionnaire, Expressions
- Responsive : hamburger menu sur mobile

## Spécifications des pages

### Page d'accueil (/)
- Titre : "Apprend-Medumba" avec sous-titre "Apprenez la langue Medumba"
- 3 cartes de navigation : Alphabet, Dictionnaire, Expressions
- Compteur : "1 855 mots disponibles"
- Brève introduction à la langue (2-3 phrases)

### Page Alphabet (/alphabet)
- Grille de 33 lettres cliquables (composant AlphabetGrid)
- Au clic : mot exemple + traduction + bouton audio
- Séparation visuelle voyelles (10) / consonnes (23)

### Page Dictionnaire (/dictionnaire)
- Barre de recherche en haut (composant SearchBar)
- Filtre par lettre (composant LetterFilter)
- Liste de WordCards, 50 par page (pagination)
- Toggle direction de recherche

### Page Détail Mot (/mot/[slug])
- Mot Medumba (grande taille, avec accents/tons)
- Traduction + catégorie grammaticale
- Bouton audio (ou message "audio bientôt disponible")
- Exemples d'utilisation avec traduction
- Boutons précédent/suivant

### Page Expressions (/expressions)
- Expressions regroupées par contexte (salutations, marché, famille...)
- Chaque expression : Medumba + traduction + bouton audio

## Configuration Vercel

```json
// vercel.json
{
  "headers": [
    {
      "source": "/audio/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

## Phase 2 — Backend Supabase (à exécuter UNIQUEMENT après validation du MVP)

### Schéma SQL

```sql
CREATE TABLE words (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  medumba TEXT NOT NULL,
  french TEXT NOT NULL,
  category TEXT,
  examples JSONB DEFAULT '[]',
  audio_path TEXT,
  has_audio BOOLEAN DEFAULT false,
  letter TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE alphabet (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  letter TEXT UNIQUE NOT NULL,
  type TEXT CHECK (type IN ('voyelle', 'consonne')),
  example_medumba TEXT,
  example_french TEXT,
  audio_path TEXT,
  has_audio BOOLEAN DEFAULT false
);

CREATE TABLE expressions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  medumba TEXT NOT NULL,
  french TEXT NOT NULL,
  context TEXT,
  audio_path TEXT,
  has_audio BOOLEAN DEFAULT false
);

CREATE TABLE audio_contributions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  word_id UUID REFERENCES words(id),
  contributor_name TEXT,
  audio_url TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  submitted_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ
);
```

### Migration
- Remplacer `import dict from '@/data/dictionary.json'` par `const { data } = await supabase.from('words').select('*')`
- Migrer les fichiers audio de /public/audio/ vers Supabase Storage bucket 'audio'
- Variables d'environnement : NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY

## Phase 3 — Mobile Capacitor (à exécuter UNIQUEMENT après stabilisation Phase 2)

```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Apprend-Medumba" com.apprendmedumba.app
npx cap add ios && npx cap add android
npm run build && npx cap sync
```
