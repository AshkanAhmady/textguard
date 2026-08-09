import type { Rule } from "../../domain/rule";

export interface DebugRuleMetadata {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly severity: Rule["severity"];
  readonly priority: number;
}
