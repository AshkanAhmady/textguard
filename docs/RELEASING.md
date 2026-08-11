# TextGuard Release Workflow

This is the canonical package-release procedure for the TextGuard monorepo.

The repository uses Changesets. Do **not** run `npm publish` from the repository root and do not manually publish every workspace package.

## Release cadence

TextGuard separates **Changeset creation** from **npm publishing**.

Every merged public runtime/API/behavior change should still carry the appropriate Changeset, but a merged Changeset does **not** imply an immediate npm publish. Pending changes should normally be batched and published after several related milestones or when there is a clear consumer-facing reason to ship.

Publish earlier only when one of these applies:

- a critical bug/security fix needs to reach consumers quickly;
- a newly completed capability is independently valuable and ready for adoption;
- a compatibility/dependency fix is blocking consumers;
- the maintainer intentionally wants a stable checkpoint before a larger development phase.

Otherwise, keep accumulating Changesets and release them together. This reduces release overhead without losing per-PR release metadata.

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

For batched releases, the plan may legitimately contain Changesets from several merged milestones. The important rule is that every candidate must be intentional and explainable.

## 3. Apply versions

Only version packages when you are intentionally preparing a release batch:

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

A versioned-but-not-yet-published release batch may remain on `main` while additional development continues, but avoid repeatedly versioning packages between every feature PR. Prefer accumulating new Changesets until the next intentional release batch.

## 4. Validate the repository

```bash
pnpm install --frozen-lockfile
pnpm test
pnpm check-types
pnpm build
```

A release PR is not ready to merge unless `pnpm install --frozen-lockfile` succeeds from the committed lockfile. Commit the generated release changes only after the release set and checks are correct.

## 5. Publish with the guard

When the batch is ready to ship:

```bash
pnpm release
```

Before building or calling `changeset publish`, `scripts/release-check.mjs` compares every public package version in `packages/` against npm. It prints the exact package versions that are ahead of the registry and requires an explicit interactive confirmation.

Example:

```text
Packages that changeset publish can publish:

- @textguard/core: npm 1.0.2 -> local 1.0.3
- @textguard/ar: npm 1.0.2 -> local 1.1.0

Type "publish 2" to continue:
```

If the list is not exactly what you expect, cancel the release.

Non-interactive publishing is blocked by default. A trusted release automation may set `TEXTGUARD_RELEASE_CONFIRM=1`, but only after it has surfaced and verified the candidate list.

## Internal dependency policy

Published TextGuard packages should use semver-compatible workspace ranges for public runtime dependencies:

```json
{
  "dependencies": {
    "@textguard/core": "workspace:^"
  }
}
```

`workspace:^` keeps local workspace resolution during development, while pnpm publishes a caret range such as `^1.0.2`. This lets a compatible Core patch remain inside the consumer package's dependency range instead of forcing an unrelated patch release across every dependent workspace.

Use `workspace:*` only where exact workspace coupling is intentional, such as private repository tooling/dev dependencies. Do not use it for normal public runtime dependencies when semver compatibility is intended.

Changesets also uses:

```json
{
  "updateInternalDependencies": "minor"
}
```

Together, the caret workspace ranges and this Changesets setting avoid unnecessary patch-release propagation while still allowing dependency metadata to update when an existing semver range is no longer valid.

## Release rule

A merged runtime/public-package change should have a Changeset. After merge, record the pending release impact, but do **not** automatically publish. Batch normal releases across multiple coherent milestones and publish only when the release batch is intentionally opened.
