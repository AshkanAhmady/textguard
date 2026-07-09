export interface PipelineFinishedEvent {
  readonly type: "pipeline:finished";
  readonly timestamp: number;
}
