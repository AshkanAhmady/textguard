import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

export const PRE_COMMIT_COMMAND = "npx textguard-pii";
export const PII_WORKFLOW_PATH = ".github/workflows/pii-scan.yml";
export const PRE_COMMIT_PATH = ".husky/pre-commit";

export const PII_WORKFLOW_TEMPLATE = `name: PII Scan

on:
  pull_request:

jobs:
  pii-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm install @textguard/plugin-pii

      - run: >
          npx textguard-pii-ci
          --base \${{ github.event.pull_request.base.sha }}
          --head \${{ github.sha }}
`;

export function addPreCommitCommand(existing: string): string {
  if (existing.includes(PRE_COMMIT_COMMAND)) return existing;

  const trimmed = existing.trimEnd();
  return `${trimmed}${trimmed ? "\n" : ""}${PRE_COMMIT_COMMAND}\n`;
}

export interface InitResult {
  readonly preCommit: "created" | "updated" | "unchanged";
  readonly workflow: "created" | "skipped-existing";
}

export function initializeConsumer(cwd = process.cwd()): InitResult {
  const preCommitPath = join(cwd, PRE_COMMIT_PATH);
  const workflowPath = join(cwd, PII_WORKFLOW_PATH);

  mkdirSync(dirname(preCommitPath), { recursive: true });
  mkdirSync(dirname(workflowPath), { recursive: true });

  let preCommit: InitResult["preCommit"];
  if (!existsSync(preCommitPath)) {
    writeFileSync(preCommitPath, `${PRE_COMMIT_COMMAND}\n`, "utf-8");
    preCommit = "created";
  } else {
    const existing = readFileSync(preCommitPath, "utf-8");
    const next = addPreCommitCommand(existing);

    if (next === existing) {
      preCommit = "unchanged";
    } else {
      writeFileSync(preCommitPath, next, "utf-8");
      preCommit = "updated";
    }
  }

  let workflow: InitResult["workflow"];
  if (existsSync(workflowPath)) {
    workflow = "skipped-existing";
  } else {
    writeFileSync(workflowPath, PII_WORKFLOW_TEMPLATE, "utf-8");
    workflow = "created";
  }

  return { preCommit, workflow };
}

export function printInitResult(result: InitResult): void {
  console.log("textguard-pii init complete.");
  console.log(`- pre-commit: ${result.preCommit}`);
  console.log(`- GitHub workflow: ${result.workflow}`);

  if (result.workflow === "skipped-existing") {
    console.log(
      `- ${PII_WORKFLOW_PATH} already exists and was not overwritten; add textguard-pii-ci manually if needed.`,
    );
  }

  console.log(
    "- Ensure Husky is installed and initialized in this project so .husky/pre-commit is executed.",
  );
}
