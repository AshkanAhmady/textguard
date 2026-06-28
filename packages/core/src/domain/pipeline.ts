import type { Normalizer } from "./normalizer";

export interface Pipeline {
  readonly normalizers: readonly Normalizer[];

  run(text: string): string;
}
