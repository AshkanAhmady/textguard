import type { Normalizer } from "../domain/normalizer";

export class PersianNormalizer implements Normalizer {
  normalize(text: string): string {
    return text.replace(/ي/g, "ی").replace(/ك/g, "ک");
  }
}
