import { createFilter } from "@textguard/core";
import type { Match } from "@textguard/core";
import { piiPreset } from "./preset";
import { applyPolicy, type PiiPolicyConfig } from "./policy";

export type PiiType = "email" | "phone" | "credit-card" | "iban";

export interface PiiFinding {
  type: PiiType;
  matchedText: string;
  start: number;
  end: number;
}

export interface ScanResult {
  clean: boolean;
  findings: PiiFinding[];
}

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

export function scanFile(
  path: string,
  text: string,
  config: PiiPolicyConfig = {},
): ScanResult {
  return applyPolicy(path, scanText(text), config);
}

export function scanMany(inputs: string[]): ScanResult[] {
  return inputs.map(scanText);
}
