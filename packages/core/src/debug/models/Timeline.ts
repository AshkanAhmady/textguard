import type { TimelineNode } from "./TimelineNode";

export interface Timeline {
  readonly nodes: readonly TimelineNode[];
}
