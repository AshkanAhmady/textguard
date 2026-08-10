import { execSync } from "node:child_process";
import { scanFile } from "./scan";
import { loadPiiConfig } from "./config";
import { toFileResult, formatConsoleReport, type FileResult } from "./report";
import { initializeConsumer, printInitResult } from "./init";

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
    return null;
  }
}

function scanStagedFiles(): void {
  const files = getStagedFiles();
  const config = loadPiiConfig();
  const results: FileResult[] = [];

  for (const file of files) {
    const content = getStagedContent(file);
    if (content === null) continue;

    results.push(toFileResult(file, content, scanFile(file, content, config)));
  }

  const report = formatConsoleReport(results);
  const hasFindings = results.some((result) => result.findings.length > 0);

  if (hasFindings) {
    console.error(`\n${report}`);
    console.error(
      "\ntextguard-pii: commit blocked — remove the PII above or configure an explicit policy exception.\n",
    );
    process.exit(1);
  }

  process.exit(0);
}

function main(): void {
  if (process.argv[2] === "init") {
    printInitResult(initializeConsumer());
    process.exit(0);
  }

  scanStagedFiles();
}

main();
