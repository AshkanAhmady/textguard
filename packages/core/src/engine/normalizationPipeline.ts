import type { Pipeline } from "../domain/pipeline";
import type { Normalizer } from "../domain/normalizer";

export class NormalizationPipeline implements Pipeline {
  constructor(readonly normalizers: readonly Normalizer[]) {}

  run(text: string): string {
    let normalized = text;

    for (const normalizer of this.normalizers) {
      normalized = normalizer.normalize(normalized);
    }

    return normalized;
  }
}
