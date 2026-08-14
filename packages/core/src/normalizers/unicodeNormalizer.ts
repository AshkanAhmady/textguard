import type { NormalizationResult, Normalizer } from "../domain/normalizer";
import { normalizeCanonicalClustersWithMapping } from "./mapping";

const INVISIBLE_OBFUSCATION = /[\u200B\u2060\uFEFF]/g;

function normalizeUnicodeCluster(cluster: string): string {
  return cluster.normalize("NFKC").replace(INVISIBLE_OBFUSCATION, "");
}

export class UnicodeNormalizer implements Normalizer {
  normalize(text: string): string {
    return normalizeUnicodeCluster(text);
  }

  normalizeWithMapping(text: string): NormalizationResult {
    return normalizeCanonicalClustersWithMapping(text, normalizeUnicodeCluster);
  }
}
