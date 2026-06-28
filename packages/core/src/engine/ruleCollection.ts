import type { Rule } from "../domain/rule";

export class RuleCollection {
  private readonly rules: Rule[] = [];

  constructor(rules: readonly Rule[] = []) {
    this.rules.push(...rules);
  }

  add(rule: Rule): void {
    this.rules.push(rule);
  }

  getAll(): readonly Rule[] {
    return this.rules;
  }
}
