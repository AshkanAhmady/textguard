import { execFileSync, spawnSync } from "node:child_process";
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

function run(command, args, cwd, options = {}) {
  return execFileSync(command, args, {
    cwd,
    encoding: "utf-8",
    stdio: options.stdio ?? "pipe",
    env: process.env,
  });
}

function runStatus(command, args, cwd) {
  return spawnSync(command, args, {
    cwd,
    encoding: "utf-8",
    stdio: "pipe",
    env: process.env,
  });
}

const packageDir = resolve(import.meta.dirname, "../../packages/guards/pii");
const tempRoot = mkdtempSync(join(tmpdir(), "textguard-pii-e2e-"));
const consumerDir = join(tempRoot, "consumer");
mkdirSync(consumerDir, { recursive: true });

try {
  run("pnpm", ["pack", "--pack-destination", tempRoot], packageDir);
  const tarball = readdirSync(tempRoot)
    .filter((name) => name.endsWith(".tgz"))
    .map((name) => join(tempRoot, name))[0];

  if (!tarball) throw new Error("PII package tarball was not created");

  run("git", ["init"], consumerDir);
  run("git", ["config", "user.name", "TextGuard E2E"], consumerDir);
  run("git", ["config", "user.email", "textguard-e2e@example.invalid"], consumerDir);
  run("npm", ["init", "-y"], consumerDir);
  writeFileSync(join(consumerDir, ".gitignore"), "node_modules/\n");
  run("npm", ["install", "-D", tarball, "husky@9"], consumerDir);
  run("npx", ["husky", "init"], consumerDir);
  run("npx", ["textguard-pii", "init"], consumerDir);

  if (!existsSync(join(consumerDir, ".husky", "pre-commit"))) {
    throw new Error("init did not prepare the pre-commit hook");
  }
  if (!existsSync(join(consumerDir, ".github", "workflows", "pii-scan.yml"))) {
    throw new Error("init did not prepare the GitHub workflow");
  }

  writeFileSync(join(consumerDir, "README.md"), "# clean consumer baseline\n");
  run("git", ["add", "."], consumerDir);
  run("git", ["commit", "-m", "baseline"], consumerDir);

  const blockedEmail = ["blocked", "example.com"].join("@");
  writeFileSync(join(consumerDir, "fixture.txt"), `contact: ${blockedEmail}\n`);
  run("git", ["add", "fixture.txt"], consumerDir);

  const blockedCommit = runStatus("git", ["commit", "-m", "test blocked pii"], consumerDir);
  if (blockedCommit.status === 0) {
    throw new Error("pre-commit hook allowed non-allowlisted PII");
  }

  const policy = {
    allowlist: { email: [blockedEmail] },
    ignorePaths: ["fixtures/**"],
  };
  writeFileSync(join(consumerDir, "textguard-pii.config.json"), `${JSON.stringify(policy, null, 2)}\n`);
  mkdirSync(join(consumerDir, "fixtures"), { recursive: true });
  const ignoredEmail = ["ignored", "example.com"].join("@");
  writeFileSync(join(consumerDir, "fixtures", "sample.txt"), `contact: ${ignoredEmail}\n`);
  run("git", ["add", "."], consumerDir);
  run("git", ["commit", "-m", "allow intentional test pii"], consumerDir);

  run("npx", ["textguard-pii-ci", "--base", "HEAD~1", "--head", "HEAD"], consumerDir);

  const rejectedEmail = ["rejected", "example.com"].join("@");
  writeFileSync(join(consumerDir, "leak.txt"), `contact: ${rejectedEmail}\n`);
  run("git", ["add", "leak.txt"], consumerDir);
  run("git", ["commit", "--no-verify", "-m", "seed ci rejection"], consumerDir);

  const rejectedCi = runStatus("npx", ["textguard-pii-ci", "--base", "HEAD~1", "--head", "HEAD"], consumerDir);
  if (rejectedCi.status === 0) {
    throw new Error("CI scanner allowed non-allowlisted PII");
  }

  console.log("textguard-pii external consumer E2E passed");
} finally {
  rmSync(tempRoot, { recursive: true, force: true });
}
