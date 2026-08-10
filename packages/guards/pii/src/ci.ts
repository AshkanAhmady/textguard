import { execSync } from "node:child_process";
import { appendFileSync } from "node:fs";
import { scanFile } from "./scan";
import { loadPiiConfig } from "./config";
import { toFileResult, formatMarkdownReport, type FileResult } from "./report";

function getArg(flag: string): string | undefined {
  const index = process.argv.indexOf(flag);
  return index !== -1 ? process.argv[index + 1] : undefined;
}

function getChangedFiles(base: string, head: string): string[] {
  const output = execSync(`git diff --name-only --diff-filter=ACM ${base} ${head}`, {
    encoding: "utf-8",
  });
  return output.split("\n").filter(Boolean);
}

function getFileContentAt(ref: string, path: string): string | null {
  try {
    return execSync(`git show ${ref}:"${path}"`, { encoding: "utf-8" });
  } catch {
    return null;
  }
}

function writeStepSummary(markdown: string): void {
  const summaryPath = process.env.GITHUB_STEP_SUMMARY;
  if (!summaryPath) return;

  try {
    appendFileSync(summaryPath, markdown);
  } catch {
    // Summary is optional.
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
  const config = loadPiiConfig();
  const results: FileResult[] = [];

  for (const file of files) {
    const content = getFileContentAt(head, file);
    if (content === null) continue;

    const fileResult = toFileResult(file, content, scanFile(file, content, config));
    results.push(fileResult);

    for (const finding of fileResult.findings) {
      console.log(
        `::error file=${file},line=${finding.line}::PII detected [${finding.type}]: "${finding.matchedText}"`,
      );
    }
  }

  writeStepSummary(formatMarkdownReport(results));

  if (results.some((result) => result.findings.length > 0)) {
    console.error(
      "\ntextguard-pii: PII found in this PR — see annotations and the job summary above.\n",
    );
    process.exit(1);
  }

  process.exit(0);
}

main();
