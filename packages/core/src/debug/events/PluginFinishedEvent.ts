export interface PluginFinishedEvent {
  readonly type: "plugin:finished";
  readonly plugin: string;
  readonly timestamp: number;
}
