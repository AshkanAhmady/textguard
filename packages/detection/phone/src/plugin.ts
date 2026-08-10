import type { Plugin, PluginContext } from "@textguard/core";

import { PhoneRule } from "./rules/PhoneRule";

export class PhonePlugin implements Plugin {
  readonly name = "phone";

  setup(context: PluginContext): void {
    context.addRule(PhoneRule);
  }
}
