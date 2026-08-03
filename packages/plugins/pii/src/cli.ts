import { execSync } from "node:child_process";
import { scanText } from "./scan";

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

function lineNumberAt(text: string, index: number): number {
  return text.slice(0, index).split("\n").length;
}

function main(): void {
  const files = getStagedFiles();
  let hasFindings = false;

  for (const file of files) {
    const content = getStagedContent(file);

    if (content === null) continue;

    const result = scanText(content);

    if (!result.clean) {
      hasFindings = true;
      console.error(`\n✖ PII detected in ${file}:`);

      for (const finding of result.findings) {
        const line = lineNumberAt(content, finding.start);
        console.error(
          `  line ${line}: [${finding.type}] "${finding.matchedText}"`,
        );
      }
    }
  }

  if (hasFindings) {
    console.error(
      "\ntextguard-pii: commit blocked — remove the PII above, or run " +
        "`git commit --no-verify` to bypass (not recommended).\n",
    );
    process.exit(1);
  }

  process.exit(0);
}

main();
