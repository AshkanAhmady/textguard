import type { Dictionary } from "../domain/dictionary";

export interface EngineState {
  dictionaries: readonly Dictionary[];

  customWords: readonly (string | RegExp)[];

  whitelist: readonly string[];

  mask: string;

  leetspeakMapping: Readonly<Record<string, readonly string[]>>;

  faLookalikesMapping: Readonly<Record<string, string>>;
}
