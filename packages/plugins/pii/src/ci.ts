import { execSync } from "node:child_process";
import { appendFileSync } from "node:fs";
import { scanText } from "./scan";
import { toFileResult, formatMarkdownReport, type FileResult } from "./report";

function getArg(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index !== -1 ? process.argv[index + 1] : undefined;
}

function getChangedFiles(base: string, head: string): string[] {
  const output = execSync(
    `git diff --name-only --diff-filter=ACM ${base} ${head}`,
    { encoding: "utf-8" },
  );

  return output.split("\n").filter(Boolean);
}

function getFileContentAt(ref: string, path: string): string | null {
  try {
    return execSync(`git show ${ref}:"${path}"`, { encoding: "utf-8" });
  } catch {
    // Binary file, or not readable as text — skip rather than crash.
    return null;
  }
}

/**
 * Writes the markdown report to GitHub's step summary, if running in
 * Actions ($GITHUB_STEP_SUMMARY is set). No-op locally.
 */
function writeStepSummary(markdown: string): void {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) return;

  try {
    appendFileSync(summaryPath, markdown);
  } catch {
    // Summary is a nice-to-have — never fail the job because of it.
  }
}

function main(): void {
  const base = getArg("--base");
  const head = getArg("--head") ?? "HEAD";

  if (!base) {
    console.error("textguard-pii-ci: missing required --base <ref>");
    process.exit(2);
  }

  const files = getChangedFiles(base, head);
  const results: FileResult[] = [];

  for (const file of files) {
    const content = getFileContentAt(head, file);

    if (content === null) continue;

    const result = scanText(content);
    const fileResult = toFileResult(file, content, result);
    results.push(fileResult);

    // GitHub Actions workflow-command syntax — renders as an inline
    // annotation on the PR's "Files changed" tab.
    for (const finding of fileResult.findings) {
      console.log(
        `::error file=${file},line=${finding.line}::PII detected [${finding.type}]: "${finding.matchedText}"`,
      );
    }
  }

  writeStepSummary(formatMarkdownReport(results));

  const hasFindings = results.some((r) => r.findings.length > 0);

  if (hasFindings) {
    console.error(
      "\ntextguard-pii: PII found in this PR — see annotations and the job summary above.\n",
    );
    process.exit(1);
  }

  process.exit(0);
}

main();
