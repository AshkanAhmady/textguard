import { execSync } from "node:child_process";
import { scanText } from "./scan";
import { toFileResult, formatConsoleReport, type FileResult } from "./report";

function getStagedFiles(): string[] {
  const output = execSync("git diff --cached --name-only --diff-filter=ACM", {
    encoding: "utf-8",
  });

  return output.split("\n").filter(Boolean);
}

function getStagedContent(path: string): string | null {
  try {
    return execSync(`git show ":${path}"`, { encoding: "utf-8" });
  } catch {
    // Binary file, or git couldn't read it as text — skip rather than crash.
    return null;
  }
}

function main(): void {
  const files = getStagedFiles();
  const results: FileResult[] = [];

  for (const file of files) {
    const content = getStagedContent(file);

    if (content === null) continue;

    const result = scanText(content);
    results.push(toFileResult(file, content, result));
  }

  const report = formatConsoleReport(results);
  const hasFindings = results.some((r) => r.findings.length > 0);

  if (hasFindings) {
    console.error(`\n${report}`);
    console.error(
      "\ntextguard-pii: commit blocked — remove the PII above, or run " +
        "`git commit --no-verify` to bypass (not recommended).\n",
    );
    process.exit(1);
  }

  process.exit(0);
}

main();
