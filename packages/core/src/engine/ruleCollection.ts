import type { Rule } from "../domain/rule";
import type { RegisteredRule } from "../domain/registeredRule";

export class RuleCollection {
  private readonly rules: RegisteredRule[] = [];

  constructor(rules: readonly RegisteredRule[] = []) {
    this.rules.push(...rules);
  }

  add(rule: Rule, plugin: string): void {
    this.rules.push({
      rule,
      plugin,
    });
  }

  getAll(): readonly RegisteredRule[] {
    return this.rules;
  }
}
