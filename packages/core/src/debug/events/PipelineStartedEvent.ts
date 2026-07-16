import type { BaseDebugEvent } from "./BaseDebugEvent";

export interface PipelineStartedEvent extends BaseDebugEvent {
  readonly type: "pipeline:started";
}
