import type { DebugEvent } from "../events";

export class DebugSession {
  public constructor(private readonly events: readonly DebugEvent[]) {}

  public getEvents(): readonly DebugEvent[] {
    return this.events;
  }
}
