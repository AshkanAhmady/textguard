import type { DebugSession } from "../models/DebugSession";

export interface DebugRenderer<TOutput> {
  render(session: DebugSession): TOutput;
}
