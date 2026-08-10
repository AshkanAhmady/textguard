import type { PiiFinding, ScanResult } from "./scan";

export interface FileFinding extends PiiFinding {
  line: number;
}

export interface FileResult {
  file: string;
  findings: FileFinding[];
}

/**
 * Converts a raw ScanResult into per-file findings with line numbers,
 * ready for either report formatter below.
 */
export function toFileResult(
  file: string,
  content: string,
  result: ScanResult,
): FileResult {
  const findings: FileFinding[] = result.findings.map((finding) => ({
    ...finding,
    line: content.slice(0, finding.start).split("\n").length,
  }));

  return { file, findings };
}

function totalFindings(results: FileResult[]): number {
  return results.reduce((sum, r) => sum + r.findings.length, 0);
}

/**
 * Human-readable console report — used by the pre-commit hook (cli.ts).
 */
export function formatConsoleReport(results: FileResult[]): string {
  const dirty = results.filter((r) => r.findings.length > 0);

  if (dirty.length === 0) {
    return "✔ No PII found.";
  }

  const count = totalFindings(dirty);
  const lines: string[] = [
    `✖ ${count} PII finding(s) across ${dirty.length} file(s):`,
    "",
  ];

  for (const { file, findings } of dirty) {
    lines.push(file);
    for (const finding of findings) {
      lines.push(
        `  line ${finding.line}: [${finding.type}] "${finding.matchedText}"`,
      );
    }
    lines.push("");
  }

  return lines.join("\n").trimEnd();
}

/**
 * Markdown report — used by the GitHub Action to write a PR summary via
 * $GITHUB_STEP_SUMMARY, in addition to the inline `::error` annotations
 * it already emits per finding.
 */
export function formatMarkdownReport(results: FileResult[]): string {
  const dirty = results.filter((r) => r.findings.length > 0);

  if (dirty.length === 0) {
    return "## 🔒 PII Scan\n\n✅ No PII found.\n";
  }

  const count = totalFindings(dirty);
  const lines: string[] = [
    "## 🔒 PII Scan",
    "",
    `Found **${count}** finding(s) across **${dirty.length}** file(s).`,
    "",
    "| File | Line | Type | Match |",
    "|---|---|---|---|",
  ];

  for (const { file, findings } of dirty) {
    for (const finding of findings) {
      lines.push(
        `| ${file} | ${finding.line} | ${finding.type} | \`${finding.matchedText}\` |`,
      );
    }
  }

  lines.push("");
  return lines.join("\n");
}
