import type { Plugin, PluginContext } from "@textguard/core";
import { CreditCardRule } from "./rules/creditCardRule";

export class CreditCardPlugin implements Plugin {
  readonly name = "creditCard";

  setup(context: PluginContext): void {
    context.addRule(CreditCardRule);
  }
}
