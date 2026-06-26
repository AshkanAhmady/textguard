export interface MatchContext {
  readonly text: string;
  readonly whitelist: readonly string[];
  readonly leetspeakMapping: Record<string, string[]>;
  readonly faLookalikesMapping: Record<string, string>;
}
