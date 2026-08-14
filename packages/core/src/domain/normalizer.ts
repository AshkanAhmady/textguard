export interface NormalizationResult {
  readonly text: string;
  readonly boundaryMap: readonly number[];
}

export interface Normalizer {
  normalize(text: string): string;

  /**
   * Optional range-aware normalization hook.
   *
   * `boundaryMap[n]` maps a UTF-16 boundary in the normalized output back to
   * the corresponding UTF-16 boundary in this normalizer's input.
   *
   * Existing custom normalizers only need to implement `normalize()`; this
   * hook is intentionally optional for backward compatibility.
   */
  normalizeWithMapping?(text: string): NormalizationResult;
}
