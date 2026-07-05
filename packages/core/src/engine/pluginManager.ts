import type { Plugin } from "../domain/plugin";
import type { PluginContext } from "../domain/pluginContext";

export class PluginManager {
  private readonly plugins: Plugin[] = [];

  constructor(private readonly context: PluginContext) {}

  register(plugin: Plugin): void {
    plugin.setup(this.context);

    this.plugins.push(plugin);
  }

  registerAll(plugins: Plugin[]): void {
    for (const plugin of plugins) {
      this.register(plugin);
    }
  }

  getPlugins(): readonly Plugin[] {
    return this.plugins;
  }
}
