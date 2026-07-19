import type { TimelinePlugin } from "./TimelinePlugin";

export interface Timeline {
  readonly plugins: readonly TimelinePlugin[];
}
