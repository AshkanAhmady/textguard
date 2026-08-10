# TextGuard Release Workflow

This is the canonical package-release procedure for the TextGuard monorepo.

The repository uses Changesets. Do **not** run `npm publish` from the repository root and do not manually publish every workspace package.

## Why this workflow exists

A release of `@textguard/core` can affect many workspace dependents. TextGuard therefore separates release planning, versioning, verification, and publishing so an unintended package wave is visible before anything reaches npm.

## 1. Start clean

```bash
git checkout main
git pull origin main
git status
```

Do not continue with unrelated local changes.

## 2. Preview the Changesets release plan

```bash
pnpm release:plan
```

Review every package and release level shown by Changesets. If the plan includes an unexpected package, stop and fix the Changeset/configuration before versioning.

## 3. Apply versions

```bash
pnpm version-packages
```

`version-packages` runs the release plan first, then `changeset version`, then installs so the lockfile stays synchronized.

Review the generated files:

```bash
git diff
```

Expected changes normally include package versions, changelogs, consumed Changeset files, internal dependency metadata when required, and the lockfile.

Do not publish when the diff contains an unexpected package bump.

## 4. Validate the repository

```bash
pnpm test
pnpm check-types
pnpm build
```

Commit the generated release changes only after the release set and checks are correct.

## 5. Publish with the guard

```bash
pnpm release
```

Before building or calling `changeset publish`, `scripts/release-check.mjs` compares every public package version in `packages/` against npm. It prints the exact package versions that are ahead of the registry and requires an explicit interactive confirmation.

Example:

```text
Packages that changeset publish can publish:

- @textguard/core: npm 1.0.2 -> local 1.0.3
- @textguard/plugin-ar: npm 1.0.2 -> local 1.1.0

Type "publish 2" to continue:
```

If the list is not exactly what you expect, cancel the release.

Non-interactive publishing is blocked by default. A trusted release automation may set `TEXTGUARD_RELEASE_CONFIRM=1`, but only after it has surfaced and verified the candidate list.

## Internal dependency policy

Changesets uses:

```json
{
  "updateInternalDependencies": "minor"
}
```

A patch release of a shared package should not automatically rewrite internal dependency references merely to chase the latest patch when existing ranges remain valid. Changesets still updates dependencies when the existing range would no longer be valid.

## Release rule

A merged runtime/public-package change should have a Changeset. After merge, explicitly review whether a package release is pending. Never infer that every workspace package should be published just because the monorepo build succeeds.
