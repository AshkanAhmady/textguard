import type { Match } from "../../domain/match";

export interface TimelineNode {
  readonly plugin: string;
  readonly rule: string;
  readonly matches: readonly Match[];
}
