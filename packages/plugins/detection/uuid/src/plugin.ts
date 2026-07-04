import type { Plugin, PluginContext } from "@textguard/core";

import { UuidRule } from "./rules/uuidRule";

export class UuidPlugin implements Plugin {
  readonly name = "uuid";

  setup(context: PluginContext): void {
    context.addRule(UuidRule);
  }
}
