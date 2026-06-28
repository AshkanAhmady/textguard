import type { Normalizer } from "../domain/normalizer";

export class WhitespaceNormalizer implements Normalizer {
  normalize(text: string): string {
    return text.replace(/\s+/g, " ").trim();
  }
}
