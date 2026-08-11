import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const cliPath = fileURLToPath(new URL("../dist/index.js", import.meta.url));

function runCli(args) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    encoding: "utf8",
  });
}

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
    expect(result.stdout).toMatch(/secret/);
  });

  it("supports json output", () => {
    const result = runCli(["scan", "hello secret", "--word=secret", "--json"]);
    const parsed = JSON.parse(result.stdout);

    expect(result.status).toBe(1);
    expect(parsed.matches).toHaveLength(1);
    expect(parsed.matches[0].matchedText).toBe("secret");
  });
});

describe("textguard debug", () => {
  it("renders a console debug report by default", () => {
    const result = runCli(["debug", "hello secret", "--word=secret"]);

    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/TextGuard Debug Report/);
    expect(result.stdout).toMatch(/Matches\s+: 1/);
  });

  it("renders json debug output", () => {
    const result = runCli([
      "debug",
      "hello secret",
      "--word=secret",
      "--format=json",
    ]);
    const parsed = JSON.parse(result.stdout);

    expect(result.status).toBe(0);
    expect(parsed.statistics.matchEvents).toBe(1);
  });

  it("renders markdown debug output", () => {
    const result = runCli(["debug", "hello world", "--format=markdown"]);

    expect(result.status).toBe(0);
    expect(result.stdout).toMatch(/^# TextGuard Debug Report/m);
  });

  it("rejects unsupported debug formats", () => {
    const result = runCli(["debug", "hello world", "--format=xml"]);

    expect(result.status).toBe(2);
    expect(result.stdout).toMatch(/Usage:/);
  });
});

describe("textguard explain", () => {
  it("prints a readable explanation and returns exit code 1 for matches", () => {
    const result = runCli(["explain", "hello secret", "--word=secret"]);

    expect(result.status).toBe(1);
    expect(result.stdout).toMatch(/TextGuard Explain/);
    expect(result.stdout).toMatch(/Matched: yes/);
    expect(result.stdout).toMatch(/Matches: 1/);
    expect(result.stdout).toMatch(/Reason:/);
  });

  it("supports machine-readable explain output", () => {
    const result = runCli([
      "explain",
      "hello secret",
      "--word=secret",
      "--json",
    ]);
    const parsed = JSON.parse(result.stdout);

    expect(result.status).toBe(1);
    expect(parsed.matched).toBe(true);
    expect(parsed.summary.matchCount).toBe(1);
    expect(parsed.matches).toHaveLength(1);
    expect(parsed.matches[0].match.matchedText).toBe("secret");
    expect(parsed.matches[0].reason.code).toBe("rule-match");
  });

  it("returns exit code 0 for a clean explanation", () => {
    const result = runCli(["explain", "hello world", "--json"]);
    const parsed = JSON.parse(result.stdout);

    expect(result.status).toBe(0);
    expect(parsed.matched).toBe(false);
    expect(parsed.summary.matchCount).toBe(0);
  });
});
