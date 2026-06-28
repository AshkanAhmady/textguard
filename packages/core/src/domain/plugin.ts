import { PluginContext } from "./pluginContext";

export interface Plugin {
  readonly name: string;

  setup(context: PluginContext): void;
}
