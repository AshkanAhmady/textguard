import type { PiiFinding, PiiType, ScanResult } from "./scan";

export interface PiiSuppression {
  path: string;
  type?: PiiType;
  matchedText?: string;
}

export interface PiiPolicyConfig {
  allowlist?: Partial<Record<PiiType, string[]>>;
  ignorePaths?: string[];
  suppressions?: PiiSuppression[];
}

function escapeRegex(value: string): string {
  return value.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
}

function globToRegExp(glob: string): RegExp {
  const normalized = glob.replace(/\\/g, "/");
  let pattern = "";

  for (let index = 0; index < normalized.length; index += 1) {
    const char = normalized[index];

    if (char === "*") {
      if (normalized[index + 1] === "*") {
        pattern += ".*";
        index += 1;
      } else {
        pattern += "[^/]*";
      }
    } else if (char === "?") {
      pattern += "[^/]";
    } else {
      pattern += escapeRegex(char);
    }
  }

  return new RegExp(`^${pattern}$`);
}

export function pathMatches(pattern: string, path: string): boolean {
  return globToRegExp(pattern).test(path.replace(/\\/g, "/"));
}

export function isPathIgnored(path: string, config: PiiPolicyConfig): boolean {
  return (config.ignorePaths ?? []).some((pattern) => pathMatches(pattern, path));
}

export function isFindingAllowed(
  path: string,
  finding: PiiFinding,
  config: PiiPolicyConfig,
): boolean {
  if ((config.allowlist?.[finding.type] ?? []).includes(finding.matchedText)) {
    return true;
  }

  return (config.suppressions ?? []).some((suppression) => {
    if (!pathMatches(suppression.path, path)) return false;
    if (suppression.type && suppression.type !== finding.type) return false;
    if (
      suppression.matchedText &&
      suppression.matchedText !== finding.matchedText
    ) {
      return false;
    }

    return true;
  });
}

export function applyPolicy(
  path: string,
  result: ScanResult,
  config: PiiPolicyConfig = {},
): ScanResult {
  if (isPathIgnored(path, config)) {
    return { clean: true, findings: [] };
  }

  const findings = result.findings.filter(
    (finding) => !isFindingAllowed(path, finding, config),
  );

  return {
    clean: findings.length === 0,
    findings,
  };
}
