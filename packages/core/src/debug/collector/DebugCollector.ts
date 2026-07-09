import { DebugSession } from "../models/DebugSession";
import type { DebugEvent } from "../events";

export class DebugCollector {
  private readonly events: DebugEvent[] = [];

  public addEvent(event: DebugEvent): void {
    this.events.push(event);
  }

  public build(): DebugSession {
    return new DebugSession(Object.freeze([...this.events]));
  }
}
