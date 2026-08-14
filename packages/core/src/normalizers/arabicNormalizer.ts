import type { NormalizationResult, Normalizer } from "../domain/normalizer";
import { normalizeCharactersWithMapping } from "./mapping";

function normalizeArabicCharacter(character: string): string {
  if (/[\u064B-\u0652]/u.test(character)) return "";
  if (/أ|إ|آ/u.test(character)) return "ا";
  if (character === "ؤ") return "و";
  if (character === "ئ" || character === "ى") return "ی";
  if (character === "ة") return "ه";

  return character;
}

export class ArabicNormalizer implements Normalizer {
  normalize(text: string): string {
    return text
      .replace(/[\u064B-\u0652]/g, "")
      .replace(/أ|إ|آ/g, "ا")
      .replace(/ؤ/g, "و")
      .replace(/ئ/g, "ی")
      .replace(/ى/g, "ی")
      .replace(/ة/g, "ه");
  }

  normalizeWithMapping(text: string): NormalizationResult {
    return normalizeCharactersWithMapping(text, normalizeArabicCharacter);
  }
}
