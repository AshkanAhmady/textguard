import type { Match } from "../../domain/match";

export interface TimelineRule {
  readonly name: string;
  readonly matches: readonly Match[];
}
