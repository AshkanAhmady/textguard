import type { Plugin, PluginContext } from "@textguard/core";

import { EmailRule } from "./rules/emailRule";

export class EmailPlugin implements Plugin {
  readonly name = "email";

  setup(context: PluginContext): void {
    context.addRule(EmailRule);
  }
}
