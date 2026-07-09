export * from "./PipelineStartedEvent";
export * from "./PipelineFinishedEvent";

export * from "./PluginStartedEvent";
export * from "./PluginFinishedEvent";

export * from "./RuleStartedEvent";
export * from "./RuleFinishedEvent";

export * from "./MatchFoundEvent";

import type { MatchFoundEvent } from "./MatchFoundEvent";
import type { PipelineFinishedEvent } from "./PipelineFinishedEvent";
import type { PipelineStartedEvent } from "./PipelineStartedEvent";
import type { PluginFinishedEvent } from "./PluginFinishedEvent";
import type { PluginStartedEvent } from "./PluginStartedEvent";
import type { RuleFinishedEvent } from "./RuleFinishedEvent";
import type { RuleStartedEvent } from "./RuleStartedEvent";

export type DebugEvent =
  | PipelineStartedEvent
  | PipelineFinishedEvent
  | PluginStartedEvent
  | PluginFinishedEvent
  | RuleStartedEvent
  | RuleFinishedEvent
  | MatchFoundEvent;
