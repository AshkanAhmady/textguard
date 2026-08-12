import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

const packagesRoot = join(process.cwd(), "packages");
const npmRegistryBaseUrl = "https://registry.npmjs.org";
const registryTimeoutMs = 5000;
const ignoredDirectories = new Set([
  "node_modules",
  "dist",
  "coverage",
  ".turbo",
]);

function findPackageJsonFiles(directory) {
  const result = [];

  for (const entry of readdirSync(directory)) {
    if (ignoredDirectories.has(entry)) {
      continue;
    }

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

async function getRegistryVersion(name) {
  let response;

  try {
    response = await fetch(
      `${npmRegistryBaseUrl}/${encodeURIComponent(name)}`,
      {
        headers: {
          accept: "application/vnd.npm.install-v1+json",
        },
        signal: AbortSignal.timeout(registryTimeoutMs),
      },
    );
  } catch (error) {
    if (error?.name === "TimeoutError" || error?.name === "AbortError") {
      throw new Error(
        `Timed out reading npm registry metadata for ${name} after ${registryTimeoutMs}ms`,
      );
    }

    throw new Error(
      `Failed to read npm registry metadata for ${name}: ${error?.message ?? error}`,
    );
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      `Failed to read npm registry metadata for ${name}: ${response.status} ${response.statusText}`,
    );
  }
  // test

  const metadata = await response.json();
  const latestVersion = metadata?.["dist-tags"]?.latest;

  if (typeof latestVersion !== "string") {
    throw new Error(
      `npm registry metadata for ${name} does not contain a latest dist-tag`,
    );
  }

  return latestVersion;
}

const packageJsonFiles = findPackageJsonFiles(packagesRoot);
const packages = packageJsonFiles
  .map((packageJsonPath) => JSON.parse(readFileSync(packageJsonPath, "utf8")))
  .filter(
    (packageJson) =>
      !packageJson.private && packageJson.name && packageJson.version,
  );

const registryResults = await Promise.all(
  packages.map(async (packageJson) => ({
    packageJson,
    registryVersion: await getRegistryVersion(packageJson.name),
  })),
);

const candidates = [];
const invalid = [];

for (const { packageJson, registryVersion } of registryResults) {
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
