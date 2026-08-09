export * from "./PipelineStartedEvent";
export * from "./PipelineFinishedEvent";

export * from "./PluginStartedEvent";
export * from "./PluginFinishedEvent";

export * from "./RuleStartedEvent";
export * from "./RuleFinishedEvent";

export * from "./MatchFoundEvent";
export * from "./MatchAcceptedEvent";
export * from "./MatchRejectedEvent";

import type { MatchAcceptedEvent } from "./MatchAcceptedEvent";
import type { MatchFoundEvent } from "./MatchFoundEvent";
import type { MatchRejectedEvent } from "./MatchRejectedEvent";
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
  | MatchFoundEvent
  | MatchAcceptedEvent
  | MatchRejectedEvent;
