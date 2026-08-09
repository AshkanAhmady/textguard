# @textguard/plugin-pii

**Stop PII from reaching a commit or pull request.**

`@textguard/plugin-pii` detects email addresses, phone numbers, credit card numbers, and IBANs and can enforce those checks locally before commits and in pull-request CI.

## Quick start

Install the package and Husky, initialize Husky, then let TextGuard wire the PII checks:

```bash
npm install -D @textguard/plugin-pii husky
npx husky init
npx textguard-pii init
```

`textguard-pii init`:

- creates or updates `.husky/pre-commit` with `npx textguard-pii`;
- preserves real commands already present in the hook;
- replaces Husky's default placeholder-only `npm test` hook when applicable;
- creates `.github/workflows/pii-scan.yml` when no workflow exists at that path;
- never overwrites an existing PII workflow file.

After setup, stage a file and commit normally. Non-allowed PII causes the pre-commit hook to exit non-zero and block the commit.

```bash
git add .
git commit -m "my change"
```

For a simple consumer-style walkthrough, see [`examples/pii-consumer`](../../../examples/pii-consumer). TextGuard CI executes that same example so the documented workflow is regression-tested.

## Library usage

```ts
import { scanText } from "@textguard/plugin-pii";

const demoEmail = ["hello", "example.com"].join("@");
const result = scanText(`Contact: ${demoEmail}`);

result.clean; // false
result.findings;
```

`scanText()` remains strict: it reports what detectors find. Consumer policy is applied separately by the file/CLI/CI surfaces.

## Allow intentional test data

Some projects intentionally contain values that look like PII in tests, fixtures, or documentation. Create `textguard-pii.config.json` in the repository root when an explicit exception is required.

```json
{
  "allowlist": {
    "email": ["fixture-email"]
  },
  "ignorePaths": ["tests/fixtures/**"],
  "suppressions": [
    {
      "path": "docs/**",
      "type": "email",
      "matchedText": "fixture-email"
    }
  ]
}
```

The same policy is used by the pre-commit CLI and the PR/CI scanner.

- `allowlist` allows exact known values for a specific detector type.
- `ignorePaths` skips whole files matching the configured glob.
- `suppressions` allow narrower exceptions restricted by path, detector type, and optionally exact matched text.

Prefer the narrowest exception that fits the case. In most cases an exact allowlisted test value is safer than ignoring a whole directory.

The library API also exposes `scanFile(path, text, config)` and the policy types for custom integrations.

## Manual pre-commit setup

If you do not want to use `init`, add this command to `.husky/pre-commit` yourself:

```sh
npx textguard-pii
```

## Manual CI setup

The `textguard-pii-ci` executable scans a git diff and exits non-zero when non-allowed PII is found:

```bash
npx textguard-pii-ci --base <base-ref> --head <head-ref>
```

`npx textguard-pii init` creates a GitHub Actions workflow using this command automatically unless a workflow already exists at `.github/workflows/pii-scan.yml`.

## Detection scope

| Type | Validation |
| --- | --- |
| Email | syntax detection |
| Phone | pattern detection |
| Credit card | Luhn checksum |
| IBAN | mod-97 checksum |

## Consumer validation

TextGuard CI executes `examples/pii-consumer/e2e.mjs`. The harness packs the real `@textguard/plugin-pii` package, installs it into a clean temporary git repository, runs the documented setup path, and verifies that:

- a non-allowlisted PII value blocks a real commit;
- an exact allowlisted value is accepted;
- ignored fixture paths are accepted;
- the CI scanner accepts policy-approved changes;
- the CI scanner rejects a non-allowlisted leak.

Detection and policy intentionally remain separate: detectors report findings; the PII policy layer decides whether an intentional finding should block.

## License

MIT
