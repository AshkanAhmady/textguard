import type { FilterOptions } from "../types";

export interface EngineState {
  readonly dictionaries: NonNullable<FilterOptions["dictionaries"]>;
  readonly customWords: NonNullable<FilterOptions["customWords"]>;
  readonly whitelist: NonNullable<FilterOptions["whitelist"]>;
  readonly mask: string;
  readonly leetspeakMapping: NonNullable<FilterOptions["leetspeakMapping"]>;
  readonly faLookalikesMapping: NonNullable<
    FilterOptions["faLookalikesMapping"]
  >;
}

export function createEngineState(options: FilterOptions): EngineState {
  return {
    dictionaries: options.dictionaries ?? [],
    customWords: options.customWords ?? [],
    whitelist: options.whitelist ?? [],
    mask: options.mask ?? "*",
    leetspeakMapping: options.leetspeakMapping ?? {},
    faLookalikesMapping: options.faLookalikesMapping ?? {},
  };
}
