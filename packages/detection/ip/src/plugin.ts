import type { Plugin, PluginContext } from "@textguard/core";
import { IpRule } from "./rules/ipRule";

export class IpPlugin implements Plugin {
  readonly name = "ip";

  setup(context: PluginContext): void {
    context.addRule(IpRule);
  }
}
