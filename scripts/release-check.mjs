import { execFileSync } from "node:child_process";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const packagesRoot = join(process.cwd(), "packages");
const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function findPackageJsonFiles(directory) {
  const result = [];

  for (const entry of readdirSync(directory)) {
    const path = join(directory, entry);
    const stats = statSync(path);

    if (stats.isDirectory()) {
      result.push(...findPackageJsonFiles(path));
      continue;
    }

    if (entry === "package.json") {
      result.push(path);
    }
  }

  return result;
}

function parseVersion(version) {
  const match = /^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/.exec(version);

  if (!match) {
    throw new Error(`Unsupported semver value: ${version}`);
  }

  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] ?? null,
  };
}

function compareVersions(left, right) {
  const a = parseVersion(left);
  const b = parseVersion(right);

  for (const key of ["major", "minor", "patch"]) {
    if (a[key] !== b[key]) return a[key] > b[key] ? 1 : -1;
  }

  if (a.prerelease === b.prerelease) return 0;
  if (a.prerelease === null) return 1;
  if (b.prerelease === null) return -1;
  return a.prerelease.localeCompare(b.prerelease);
}

function getRegistryVersion(name) {
  try {
    const raw = execFileSync(
      npmCommand,
      ["view", name, "version", "--json"],
      { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] },
    ).trim();

    return JSON.parse(raw);
  } catch (error) {
    const stderr = error?.stderr?.toString?.() ?? "";

    if (stderr.includes("E404") || stderr.includes("404 Not Found")) {
      return null;
    }

    throw error;
  }
}

const candidates = [];
const invalid = [];

for (const packageJsonPath of findPackageJsonFiles(packagesRoot)) {
  const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));

  if (packageJson.private || !packageJson.name || !packageJson.version) {
    continue;
  }

  const registryVersion = getRegistryVersion(packageJson.name);

  if (registryVersion === null) {
    candidates.push({
      name: packageJson.name,
      local: packageJson.version,
      registry: "not published",
    });
    continue;
  }

  const comparison = compareVersions(packageJson.version, registryVersion);

  if (comparison > 0) {
    candidates.push({
      name: packageJson.name,
      local: packageJson.version,
      registry: registryVersion,
    });
  } else if (comparison < 0) {
    invalid.push({
      name: packageJson.name,
      local: packageJson.version,
      registry: registryVersion,
    });
  }
}

if (invalid.length > 0) {
  console.error("\nRelease blocked: local versions are behind npm:\n");
  for (const item of invalid) {
    console.error(`- ${item.name}: local ${item.local}, npm ${item.registry}`);
  }
  process.exit(1);
}

if (candidates.length === 0) {
  console.log("No unpublished TextGuard package versions found.");
  process.exit(1);
}

console.log("\nPackages that changeset publish can publish:\n");
for (const item of candidates) {
  console.log(`- ${item.name}: npm ${item.registry} -> local ${item.local}`);
}
console.log("");

if (process.env.TEXTGUARD_RELEASE_CONFIRM === "1") {
  console.log("Release confirmed by TEXTGUARD_RELEASE_CONFIRM=1.");
  process.exit(0);
}

if (!process.stdin.isTTY) {
  console.error(
    "Release blocked in non-interactive mode. Set TEXTGUARD_RELEASE_CONFIRM=1 only after reviewing the package list above.",
  );
  process.exit(1);
}

const rl = createInterface({ input, output });
const expected = `publish ${candidates.length}`;
const answer = await rl.question(`Type \"${expected}\" to continue: `);
rl.close();

if (answer.trim() !== expected) {
  console.error("Release cancelled.");
  process.exit(1);
}

console.log("Release candidate list confirmed.");
