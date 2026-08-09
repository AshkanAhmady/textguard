import type { Normalizer } from "../domain/normalizer";

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
}
