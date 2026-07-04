import type { Plugin, PluginContext } from "@textguard/core";

import { UrlRule } from "./rules/UrlRule";

export class UrlPlugin implements Plugin {
  readonly name = "url";

  setup(context: PluginContext): void {
    context.addRule(UrlRule);
  }
}
