import type { Plugin } from "../domain/plugin";
import type { RuleCollection } from "./ruleCollection";
import type { NormalizerCollection } from "./normalizerCollection";
import { createPluginContext } from "../core/createPluginContext";

export class PluginManager {
  private readonly plugins: Plugin[] = [];

  constructor(
    private readonly rules: RuleCollection,
    private readonly normalizers: NormalizerCollection,
  ) {}

  register(plugin: Plugin): void {
    const context = createPluginContext(plugin, this.rules, this.normalizers);

    plugin.setup(context);

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
