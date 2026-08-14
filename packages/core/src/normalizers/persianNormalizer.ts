import type { NormalizationResult, Normalizer } from "../domain/normalizer";
import { normalizeCharactersWithMapping } from "./mapping";

function normalizePersianCharacter(character: string): string {
  if (character === "ي") return "ی";
  if (character === "ك") return "ک";

  return character;
}

export class PersianNormalizer implements Normalizer {
  normalize(text: string): string {
    return text.replace(/ي/g, "ی").replace(/ك/g, "ک");
  }

  normalizeWithMapping(text: string): NormalizationResult {
    return normalizeCharactersWithMapping(text, normalizePersianCharacter);
  }
}
