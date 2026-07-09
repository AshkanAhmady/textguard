export interface PluginStartedEvent {
  readonly type: "plugin:started";
  readonly plugin: string;
  readonly timestamp: number;
}
