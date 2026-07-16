import type { Rule } from "./rule";

export interface RegisteredRule {
  readonly rule: Rule;

  readonly plugin: string;
}
