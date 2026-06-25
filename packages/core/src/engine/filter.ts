import { FilterResult, Match } from "../types";

export interface FilterTextOptions {
  text: string;
  matches: Match[];
  mask: string;
}

export function filterText(options: FilterTextOptions): FilterResult {
  throw new Error("Not implemented");
}
