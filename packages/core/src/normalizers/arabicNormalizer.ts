import type { Normalizer } from "../domain/normalizer";

export class ArabicNormalizer implements Normalizer {
  normalize(text: string): string {
    return text
      .replace(/أ|إ|آ/g, "ا")
      .replace(/ؤ/g, "و")
      .replace(/ئ/g, "ی")
      .replace(/ة/g, "ه");
  }
}
