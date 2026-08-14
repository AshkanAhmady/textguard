import type {
  NormalizationResult,
  Normalizer,
} from "../domain/normalizer";
import { createIdentityBoundaryMap } from "../normalizers/mapping";

function createLegacyBoundaryMap(
  inputLength: number,
  outputLength: number,
): number[] {
  return Array.from(
    { length: outputLength + 1 },
    (_, index) => Math.min(index, inputLength),
  );
}

function runNormalizer(
  normalizer: Normalizer,
  text: string,
): NormalizationResult {
  if (normalizer.normalizeWithMapping) {
    return normalizer.normalizeWithMapping(text);
  }

  const normalizedText = normalizer.normalize(text);

  return {
    text: normalizedText,
    boundaryMap:
      normalizedText.length === text.length
        ? createIdentityBoundaryMap(text.length)
        : createLegacyBoundaryMap(text.length, normalizedText.length),
  };
}

export class NormalizationPipeline {
  constructor(readonly normalizers: readonly Normalizer[]) {}

  run(text: string): string {
    return this.runWithMapping(text).text;
  }

  runWithMapping(text: string): NormalizationResult {
    let normalizedText = text;
    let boundaryMap = createIdentityBoundaryMap(text.length);

    for (const normalizer of this.normalizers) {
      const result = runNormalizer(normalizer, normalizedText);
      const previousBoundaryMap = boundaryMap;
      const maxPreviousBoundary = previousBoundaryMap.length - 1;

      boundaryMap = result.boundaryMap.map((boundary) => {
        const safeBoundary = Math.max(
          0,
          Math.min(boundary, maxPreviousBoundary),
        );

        return previousBoundaryMap[safeBoundary] ?? 0;
      });

      normalizedText = result.text;
    }

    return {
      text: normalizedText,
      boundaryMap,
    };
  }
}
