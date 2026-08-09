import type { DebugSession } from "../../debug/models/DebugSession";
import type { MatchAcceptedEvent } from "../../debug/events/MatchAcceptedEvent";
import type { ExplainedMatch } from "../models/ExplainedMatch";
import type { ExplainResult } from "../models/ExplainResult";

export class ExplainBuilder {
  public build(session: DebugSession): ExplainResult {
    const acceptedEvents = session
      .getEvents()
      .filter(
        (event): event is MatchAcceptedEvent => event.type === "match:accepted",
      );

    const matches: readonly ExplainedMatch[] = Object.freeze(
      acceptedEvents.map((event) => ({
        match: event.match,
        source: {
          plugin: event.plugin,
          rule: event.ruleMetadata,
        },
        reason: {
          code: "rule-match" as const,
          message: `Matched by rule "${event.ruleMetadata.name}".`,
        },
      })),
    );

    const plugins = Object.freeze([
      ...new Set(matches.map((item) => item.source.plugin)),
    ]);
    const categories = Object.freeze([
      ...new Set(matches.map((item) => item.source.rule.category)),
    ]);

    return {
      input: session.getInput(),
      normalizedInput: session.getNormalizedInput(),
      matched: matches.length > 0,
      matches,
      summary: {
        matched: matches.length > 0,
        matchCount: matches.length,
        plugins,
        categories,
      },
    };
  }
}
