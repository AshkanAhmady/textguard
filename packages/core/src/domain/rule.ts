import type { Match } from "../types";

export interface Rule {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly severity: "low" | "medium" | "high";

  match(text: string): Match[];
}
