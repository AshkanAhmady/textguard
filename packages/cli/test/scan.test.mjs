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
