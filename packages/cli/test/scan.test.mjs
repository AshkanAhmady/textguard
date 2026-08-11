import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

const cliPath = fileURLToPath(new URL("../dist/index.js", import.meta.url));
const tempDirs = [];
function runCli(args, input) { return spawnSync(process.execPath, [cliPath, ...args], { encoding: "utf8", input }); }
function createInputFile(content) { const dir = mkdtempSync(join(tmpdir(), "textguard-cli-")); tempDirs.push(dir); const path = join(dir, "input.txt"); writeFileSync(path, content, "utf8"); return path; }
afterEach(() => { while (tempDirs.length > 0) rmSync(tempDirs.pop(), { recursive: true, force: true }); });

describe("textguard cli metadata", () => {
  it("prints help with exit code 0", () => {
    const result = runCli(["--help"]);
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/TextGuard CLI/);
    expect(result.stdout).toMatch(/textguard scan/);
  });
  it("prints help when no command is provided", () => {
    const result = runCli([]);
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/Usage:/);
  });
  it("prints the cli version", () => {
    const result = runCli(["--version"]);
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe("0.1.0");
  });
});

describe("textguard scan", () => {
  it("returns clean result with exit code 0", () => { const result = runCli(["scan", "hello world"]); expect(result.status).toBe(0); expect(result.stdout).toMatch(/Matches: 0/); });
  it("detects custom words and returns exit code 1", () => { const result = runCli(["scan", "hello secret", "--word=secret"]); expect(result.status).toBe(1); expect(result.stdout).toMatch(/Matches: 1/); });
  it("supports json output", () => { const result = runCli(["scan", "hello secret", "--word=secret", "--json"]); expect(result.status).toBe(1); expect(JSON.parse(result.stdout).matches[0].matchedText).toBe("secret"); });
  it("reads scan text from stdin when text is dash", () => { const result = runCli(["scan", "-", "--word=secret"], "hello secret\n"); expect(result.status).toBe(1); expect(result.stdout).toMatch(/Matches: 1/); });
  it("reads scan text from a UTF-8 file", () => { const path = createInputFile("hello secret\n"); const result = runCli(["scan", `--file=${path}`, "--word=secret", "--json"]); expect(result.status).toBe(1); expect(JSON.parse(result.stdout).matches[0].matchedText).toBe("secret"); });
  it("batch scans multiple UTF-8 files", () => { const cleanPath = createInputFile("hello world"); const matchedPath = createInputFile("hello secret"); const result = runCli(["scan", `--files=${cleanPath},${matchedPath}`, "--word=secret", "--json"]); const parsed = JSON.parse(result.stdout); expect(result.status).toBe(1); expect(parsed.summary.fileCount).toBe(2); expect(parsed.summary.matchedFiles).toBe(1); expect(parsed.summary.matchCount).toBe(1); });
  it("returns exit code 0 when every batch file is clean", () => { const first = createInputFile("hello world"); const second = createInputFile("another clean message"); const result = runCli(["scan", `--files=${first},${second}`, "--json"]); expect(result.status).toBe(0); expect(JSON.parse(result.stdout).summary.matchCount).toBe(0); });
  it("rejects missing files in batch mode", () => { const path = createInputFile("hello world"); const result = runCli(["scan", `--files=${path},missing-textguard-batch-input.txt`]); expect(result.status).toBe(2); expect(result.stdout).toMatch(/Usage:/); });
  it("rejects text and file input together", () => { const path = createInputFile("hello secret"); const result = runCli(["scan", "hello", `--file=${path}`]); expect(result.status).toBe(2); });
  it("rejects text and batch input together", () => { const path = createInputFile("hello secret"); const result = runCli(["scan", "hello", `--files=${path}`]); expect(result.status).toBe(2); });
  it("rejects missing files", () => { expect(runCli(["scan", "--file=missing-textguard-input.txt"]).status).toBe(2); });
  it("rejects empty stdin input", () => { expect(runCli(["scan", "-"], "\n").status).toBe(2); });
});

describe("textguard debug", () => {
  it("renders a console debug report by default", () => { const result = runCli(["debug", "hello secret", "--word=secret"]); expect(result.status).toBe(0); expect(result.stdout).toMatch(/TextGuard Debug Report/); });
  it("renders json debug output", () => { const result = runCli(["debug", "hello secret", "--word=secret", "--format=json"]); expect(JSON.parse(result.stdout).statistics.matchEvents).toBe(1); });
  it("renders markdown debug output", () => { expect(runCli(["debug", "hello world", "--format=markdown"]).stdout).toMatch(/^# TextGuard Debug Report/m); });
  it("reads debug text from stdin", () => { expect(JSON.parse(runCli(["debug", "-", "--word=secret", "--format=json"], "hello secret\n").stdout).statistics.matchEvents).toBe(1); });
  it("reads debug text from a file", () => { const path = createInputFile("hello secret"); const result = runCli(["debug", `--file=${path}`, "--word=secret", "--format=json"]); expect(result.status).toBe(0); expect(JSON.parse(result.stdout).statistics.matchEvents).toBe(1); });
  it("rejects unsupported debug formats", () => { expect(runCli(["debug", "hello world", "--format=xml"]).status).toBe(2); });
});

describe("textguard explain", () => {
  it("prints a readable explanation and returns exit code 1 for matches", () => { const result = runCli(["explain", "hello secret", "--word=secret"]); expect(result.status).toBe(1); expect(result.stdout).toMatch(/TextGuard Explain/); });
  it("supports machine-readable explain output", () => { const result = runCli(["explain", "hello secret", "--word=secret", "--json"]); expect(result.status).toBe(1); expect(JSON.parse(result.stdout).matches[0].reason.code).toBe("rule-match"); });
  it("reads explain text from stdin", () => { expect(JSON.parse(runCli(["explain", "-", "--word=secret", "--json"], "hello secret\n").stdout).summary.matchCount).toBe(1); });
  it("reads explain text from a file", () => { const path = createInputFile("hello secret"); const result = runCli(["explain", `--file=${path}`, "--word=secret", "--json"]); expect(result.status).toBe(1); expect(JSON.parse(result.stdout).summary.matchCount).toBe(1); });
  it("returns exit code 0 for a clean explanation", () => { const result = runCli(["explain", "hello world", "--json"]); expect(result.status).toBe(0); expect(JSON.parse(result.stdout).matched).toBe(false); });
});
