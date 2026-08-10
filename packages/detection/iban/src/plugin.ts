import type { Plugin, PluginContext } from "@textguard/core";
import { IbanRule } from "./rules/ibanRule";

export class IbanPlugin implements Plugin {
  readonly name = "iban";

  setup(context: PluginContext): void {
    context.addRule(IbanRule);
  }
}
