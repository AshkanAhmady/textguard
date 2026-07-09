export interface PipelineStartedEvent {
  readonly type: "pipeline:started";
  readonly timestamp: number;
}
