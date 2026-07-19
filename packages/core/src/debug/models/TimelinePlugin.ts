import type { TimelineRule } from "./TimelineRule";

export interface TimelinePlugin {
  readonly name: string;
  readonly rules: readonly TimelineRule[];
}
