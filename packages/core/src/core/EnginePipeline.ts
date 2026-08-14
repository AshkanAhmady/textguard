import type { DebugCollector } from "../debug";
import type { Match } from "../domain/match";
import { findMatches } from "../engine/findMatches";
import type { NormalizationPipeline } from "../engine/normalizationPipeline";
import type { RuleCollection } from "../engine/ruleCollection";
import type { EngineState } from "../engine/state";

function projectMatchToOriginalInput(
  input: string,
  boundaryMap: readonly number[],
  match: Match,
): Match {
  const maxBoundary = boundaryMap.length - 1;
  const normalizedStart = Math.max(0, Math.min(match.start, maxBoundary));
  const normalizedEnd = Math.max(0, Math.min(match.end, maxBoundary));
  const start = boundaryMap[normalizedStart] ?? 0;
  const end = boundaryMap[normalizedEnd] ?? start;

  return {
    ...match,
    matchedText: input.slice(start, end),
    start,
    end,
  };
}

export class EnginePipeline {
  public constructor(
    private readonly pipeline: NormalizationPipeline,
    private readonly rules: RuleCollection,
    private readonly state: EngineState,
  ) {}

  public execute(text: string): Match[] {
    if (!text) return [];

    const normalization = this.pipeline.runWithMapping(text);
    const projectMatch = (match: Match) =>
      projectMatchToOriginalInput(text, normalization.boundaryMap, match);

    return findMatches(
      this.rules.getAll(),
      {
        text: normalization.text,
        state: this.state,
      },
      undefined,
      projectMatch,
    );
  }

  public executeWithDebug(text: string, collector: DebugCollector): Match[] {
    collector.addEvent({
      type: "pipeline:started",
      timestamp: Date.now(),
    });

    const normalization = this.pipeline.runWithMapping(text);
    const projectMatch = (match: Match) =>
      projectMatchToOriginalInput(text, normalization.boundaryMap, match);

    const matches = findMatches(
      this.rules.getAll(),
      {
        text: normalization.text,
        state: this.state,
      },
      collector,
      projectMatch,
    );

    collector.setExecutionState(text, normalization.text, matches);

    collector.addEvent({
      type: "pipeline:finished",
      timestamp: Date.now(),
    });

    return matches;
  }
}
