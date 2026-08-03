import { createFilter } from "@textguard/core";
import type { Match } from "@textguard/core";
import { piiPreset } from "./preset";

export type PiiType = "email" | "phone" | "credit-card" | "iban";

export interface PiiFinding {
  /** Which detector matched — mirrors the rule's `word` identifier. */
  type: PiiType;
  matchedText: string;
  start: number;
  end: number;
}

export interface ScanResult {
  clean: boolean;
  findings: PiiFinding[];
}

/**
 * Defensive backstop, not the primary fix. The primary fix is the plugin
 * order in `preset.ts` (validator-backed rules registered before `phone`),
 * because the core engine already resolves same-length overlaps before
 * `findBadWords()` returns anything to us — by the time a match reaches
 * here, an overlapping loser is usually already gone. This function only
 * helps in the rarer case where two *differently-sized* overlapping
 * matches both survive the core engine and reach us.
 */
const TYPE_PRECEDENCE: Record<PiiType, number> = {
  "credit-card": 0,
  iban: 1,
  email: 2,
  phone: 3,
};

function resolveOverlaps(findings: PiiFinding[]): PiiFinding[] {
  const sorted = [...findings].sort(
    (a, b) =>
      a.start - b.start || TYPE_PRECEDENCE[a.type] - TYPE_PRECEDENCE[b.type],
  );

  const kept: PiiFinding[] = [];

  for (const finding of sorted) {
    const overlaps = kept.some(
      (existing) =>
        finding.start < existing.end && finding.end > existing.start,
    );

    if (!overlaps) kept.push(finding);
  }

  return kept.sort((a, b) => a.start - b.start);
}

/**
 * Scans a single string for PII (email, phone, credit card, IBAN).
 *
 * This is the shared core that the pre-commit hook (M0.3) and GitHub Action
 * (M0.4) both call — neither of those should reimplement scanning logic,
 * only decide what to do with the ScanResult (block a commit, fail a PR, etc).
 *
 * Note: this currently uses `findBadWords()`, not `debug()`/Explain API,
 * because Explain API (Epic 1 / M5) isn't built yet. Once it exists, this
 * function should be upgraded to return a `why`/`howToFix` field per finding
 * instead of just position + type.
 */
export function scanText(text: string): ScanResult {
  const filter = createFilter(piiPreset);
  const matches: Match[] = filter.findBadWords(text);

  const rawFindings: PiiFinding[] = matches.map((match) => ({
    type: match.word as PiiType,
    matchedText: match.matchedText,
    start: match.start,
    end: match.end,
  }));

  const findings = resolveOverlaps(rawFindings);

  return {
    clean: findings.length === 0,
    findings,
  };
}

/**
 * Convenience for scanning multiple inputs at once — e.g. every changed
 * line in a git diff, or every line in a log file. Each input keeps its
 * own ScanResult so callers can report file/line-level detail.
 */
export function scanMany(inputs: string[]): ScanResult[] {
  return inputs.map(scanText);
}
