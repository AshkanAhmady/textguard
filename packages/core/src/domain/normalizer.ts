import type { PipelineContext } from "./pipeline";

export interface Normalizer {
  readonly id: string;

  readonly name: string;

  normalize(context: PipelineContext): PipelineContext;
}
