import { MatchContext } from "../domain/matchContext";
import { Rule } from "../domain/rule";
import { runRules } from "./runRules";

export function findMatches(rules: readonly Rule[], context: MatchContext) {
  return runRules(rules, context);
}
