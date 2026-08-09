import type { DebugCollector } from "../debug";
import type { Match } from "../domain/match";
import { findMatches } from "../engine/findMatches";
import type { NormalizationPipeline } from "../engine/normalizationPipeline";
import type { RuleCollection } from "../engine/ruleCollection";
import type { EngineState } from "../engine/state";

export class EnginePipeline {
  public constructor(
    private readonly pipeline: NormalizationPipeline,
    private readonly rules: RuleCollection,
    private readonly state: EngineState,
  ) {}

  public execute(text: string): Match[] {
    if (!text) return [];

    const normalizedText = this.pipeline.run(text);

    return findMatches(this.rules.getAll(), {
      text: normalizedText,
      state: this.state,
    });
  }

  public executeWithDebug(text: string, collector: DebugCollector): Match[] {
    collector.addEvent({
      type: "pipeline:started",
      timestamp: Date.now(),
    });

    const normalizedText = this.pipeline.run(text);

    const matches = findMatches(
      this.rules.getAll(),
      {
        text: normalizedText,
        state: this.state,
      },
      collector,
    );

    collector.setExecutionState(text, normalizedText, matches);

    collector.addEvent({
      type: "pipeline:finished",
      timestamp: Date.now(),
    });

    return matches;
  }
}
