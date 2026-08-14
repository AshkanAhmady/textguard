import type { NormalizationResult, Normalizer } from "../domain/normalizer";
import { normalizeCanonicalClustersWithMapping } from "./mapping";

export class UnicodeNormalizer implements Normalizer {
  normalize(text: string): string {
    return text.normalize("NFC");
  }

  normalizeWithMapping(text: string): NormalizationResult {
    return normalizeCanonicalClustersWithMapping(text, (cluster) =>
      cluster.normalize("NFC"),
    );
  }
}
