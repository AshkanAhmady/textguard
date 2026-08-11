import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";

const cliPath = fileURLToPath(new URL("../dist/index.js", import.meta.url));
const tempDirs = [];

function runCli(args, input) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    encoding: "utf8",
    input,
  });
}

function createInputFile(content) {
  const dir = mkdtempSync(join(tmpdir(), "textguard-cli-"));
  tempDirs.push(dir);
  const path = join(dir, "input.txt");
  writeFileSync(path, content, "utf8");
  return path;
}

afterEach(() => {
  while (tempDirs.length > 0) {
    rmSync(tempDirs.pop(), { recursive: true, force: true });
  }
});

describe("textguard scan", () => {
  it("returns clean result with exit code 0", () => {
    const result = runCli(["scan", "hello world"]);
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/Matches: 0/);
  });

  it("detects custom words and returns exit code 1", () => {
    const result = runCli(["scan", "hello secret", "--word=secret"]);
    expect(result.status).toBe(1);
    expect(result.stdout).toMatch(/Matches: 1/);
  });

  it("supports json output", () => {
    const result = runCli(["scan", "hello secret", "--word=secret", "--json"]);
    const parsed = JSON.parse(result.stdout);
    expect(result.status).toBe(1);
    expect(parsed.matches[0].matchedText).toBe("secret");
  });

  it("reads scan text from stdin when text is dash", () => {
    const result = runCli(["scan", "-", "--word=secret"], "hello secret\n");
    expect(result.status).toBe(1);
    expect(result.stdout).toMatch(/Matches: 1/);
  });

  it("reads scan text from a UTF-8 file", () => {
    const path = createInputFile("hello secret\n");
    const result = runCli(["scan", `--file=${path}`, "--word=secret", "--json"]);
    const parsed = JSON.parse(result.stdout);
    expect(result.status).toBe(1);
    expect(parsed.matches[0].matchedText).toBe("secret");
  });

  it("rejects text and file input together", () => {
    const path = createInputFile("hello secret");
    const result = runCli(["scan", "hello", `--file=${path}`]);
    expect(result.status).toBe(2);
    expect(result.stdout).toMatch(/Usage:/);
  });

  it("rejects missing files", () => {
    const result = runCli(["scan", "--file=missing-textguard-input.txt"]);
    expect(result.status).toBe(2);
    expect(result.stdout).toMatch(/Usage:/);
  });

  it("rejects empty stdin input", () => {
    const result = runCli(["scan", "-"], "\n");
    expect(result.status).toBe(2);
  });
});

describe("textguard debug", () => {
  it("renders a console debug report by default", () => {
    const result = runCli(["debug", "hello secret", "--word=secret"]);
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/TextGuard Debug Report/);
  });

  it("renders json debug output", () => {
    const result = runCli(["debug", "hello secret", "--word=secret", "--format=json"]);
    const parsed = JSON.parse(result.stdout);
    expect(result.status).toBe(0);
    expect(parsed.statistics.matchEvents).toBe(1);
  });

  it("renders markdown debug output", () => {
    const result = runCli(["debug", "hello world", "--format=markdown"]);
    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/^# TextGuard Debug Report/m);
  });

  it("reads debug text from stdin", () => {
    const result = runCli(["debug", "-", "--word=secret", "--format=json"], "hello secret\n");
    expect(JSON.parse(result.stdout).statistics.matchEvents).toBe(1);
  });

  it("reads debug text from a file", () => {
    const path = createInputFile("hello secret");
    const result = runCli(["debug", `--file=${path}`, "--word=secret", "--format=json"]);
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout).statistics.matchEvents).toBe(1);
  });

  it("rejects unsupported debug formats", () => {
    const result = runCli(["debug", "hello world", "--format=xml"]);
    expect(result.status).toBe(2);
  });
});

describe("textguard explain", () => {
  it("prints a readable explanation and returns exit code 1 for matches", () => {
    const result = runCli(["explain", "hello secret", "--word=secret"]);
    expect(result.status).toBe(1);
    expect(result.stdout).toMatch(/TextGuard Explain/);
  });

  it("supports machine-readable explain output", () => {
    const result = runCli(["explain", "hello secret", "--word=secret", "--json"]);
    const parsed = JSON.parse(result.stdout);
    expect(result.status).toBe(1);
    expect(parsed.matches[0].reason.code).toBe("rule-match");
  });

  it("reads explain text from stdin", () => {
    const result = runCli(["explain", "-", "--word=secret", "--json"], "hello secret\n");
    expect(JSON.parse(result.stdout).summary.matchCount).toBe(1);
  });

  it("reads explain text from a file", () => {
    const path = createInputFile("hello secret");
    const result = runCli(["explain", `--file=${path}`, "--word=secret", "--json"]);
    const parsed = JSON.parse(result.stdout);
    expect(result.status).toBe(1);
    expect(parsed.summary.matchCount).toBe(1);
  });

  it("returns exit code 0 for a clean explanation", () => {
    const result = runCli(["explain", "hello world", "--json"]);
    expect(result.status).toBe(0);
    expect(JSON.parse(result.stdout).matched).toBe(false);
  });
});
