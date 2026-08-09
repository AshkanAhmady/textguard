import type { ExplainedMatch } from "./ExplainedMatch";

export interface ExplainSummary {
  readonly matched: boolean;
  readonly matchCount: number;
  readonly plugins: readonly string[];
  readonly categories: readonly string[];
}

export interface ExplainResult {
  readonly input: string;
  readonly normalizedInput: string;
  readonly matched: boolean;
  readonly matches: readonly ExplainedMatch[];
  readonly summary: ExplainSummary;
}
