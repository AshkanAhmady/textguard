export interface DebugStatistics {
  readonly totalEvents: number;

  readonly pipelineEvents: number;

  readonly ruleStartedEvents: number;

  readonly ruleFinishedEvents: number;

  readonly matchEvents: number;

  readonly plugins: readonly string[];

  readonly rules: readonly string[];
}
