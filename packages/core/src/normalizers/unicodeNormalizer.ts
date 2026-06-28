import type { Normalizer } from "../domain/normalizer";

export class UnicodeNormalizer implements Normalizer {
  normalize(text: string): string {
    return text.normalize("NFC");
  }
}
