import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const cliPath = fileURLToPath(new URL("../dist/index.js", import.meta.url));

function runCli(args) {
  return spawnSync(process.execPath, [cliPath, ...args], {
    encoding: "utf8",
  });
}

test("scan returns clean result with exit code 0", () => {
  const result = runCli(["scan", "hello world"]);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /Matches: 0/);
});

test("scan detects custom words and returns exit code 1", () => {
  const result = runCli(["scan", "hello secret", "--word=secret"]);

  assert.equal(result.status, 1);
  assert.match(result.stdout, /Matches: 1/);
  assert.match(result.stdout, /secret/);
});

test("scan supports json output", () => {
  const result = runCli(["scan", "hello secret", "--word=secret", "--json"]);
  const parsed = JSON.parse(result.stdout);

  assert.equal(result.status, 1);
  assert.equal(parsed.matches.length, 1);
  assert.equal(parsed.matches[0].matchedText, "secret");
});
