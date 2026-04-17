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
