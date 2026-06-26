import type { Match } from "./match";
import type { MatchContext } from "./matchContext";

export interface Rule {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly severity: "low" | "medium" | "high";

  match(context: MatchContext): Match[];
}
