import { execSync } from "node:child_process";
import { scanText } from "./scan";

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

function lineNumberAt(text: string, index: number): number {
  return text.slice(0, index).split("\n").length;
}

function main(): void {
  const base = getArg("--base");
  const head = getArg("--head") ?? "HEAD";

  if (!base) {
    console.error("textguard-pii-ci: missing required --base <ref>");
    process.exit(2);
  }

  const files = getChangedFiles(base, head);
  let hasFindings = false;

  for (const file of files) {
    const content = getFileContentAt(head, file);

    if (content === null) continue;

    const result = scanText(content);

    if (!result.clean) {
      hasFindings = true;

      for (const finding of result.findings) {
        const line = lineNumberAt(content, finding.start);

        // GitHub Actions workflow-command syntax — renders as an inline
        // annotation on the PR's "Files changed" tab.
        console.log(
          `::error file=${file},line=${line}::PII detected [${finding.type}]: "${finding.matchedText}"`,
        );
      }
    }
  }

  if (hasFindings) {
    console.error(
      "\ntextguard-pii: PII found in this PR — see annotations above.\n",
    );
    process.exit(1);
  }

  process.exit(0);
}

main();
