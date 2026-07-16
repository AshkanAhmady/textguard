import type { BaseDebugEvent } from "./BaseDebugEvent";

export interface PipelineFinishedEvent extends BaseDebugEvent {
  readonly type: "pipeline:finished";
}
