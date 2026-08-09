# @textguard/plugin-pii

**Stop PII from reaching a commit or pull request.**

`@textguard/plugin-pii` detects email addresses, phone numbers, credit card numbers, and IBANs and can enforce those checks locally and in CI.

## Install

```bash
npm install -D @textguard/plugin-pii
```

## Set up a consumer project

```bash
npx textguard-pii init
```

`init` safely prepares the existing PII enforcement surfaces:

- creates or updates `.husky/pre-commit` with `npx textguard-pii`;
- leaves an already-configured hook unchanged;
- creates `.github/workflows/pii-scan.yml` when no workflow exists at that path;
- never overwrites an existing PII workflow file.

Husky itself must already be installed/initialized in the consuming project for `.husky/pre-commit` to run.

## Library usage

```ts
import { scanText } from "@textguard/plugin-pii";

const demoEmail = ["hello", "example.com"].join("@");
const result = scanText(`Contact: ${demoEmail}`);

result.clean; // false
result.findings;
```

## Allow intentional test data

Create `textguard-pii.config.json` in the consumer repository root. The same policy is used by the pre-commit CLI and the PR/CI scanner.

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

`allowlist` is detector-specific, so an allowed email value does not automatically allow a phone, card, or IBAN finding with the same text. `ignorePaths` skips an entire matching file. `suppressions` are intentionally narrower and can be restricted by path, detector type, and exact matched value.

Prefer the narrowest exception that fits the case. For example, use an exact allowlisted test value before ignoring a whole directory.

The library API also exposes `scanFile(path, text, config)` and the policy types when custom integration is needed.

## Manual pre-commit setup

If you prefer manual setup, add this to `.husky/pre-commit`:

```sh
npx textguard-pii
```

## Manual CI setup

The `textguard-pii-ci` executable scans a git diff and exits non-zero when non-allowed PII is found:

```bash
npx textguard-pii-ci --base <base-ref> --head <head-ref>
```

## Current detection scope

| Type | Validation |
| --- | --- |
| Email | syntax detection |
| Phone | pattern detection |
| Credit card | Luhn checksum |
| IBAN | mod-97 checksum |

## Consumer validation

TextGuard CI now packs `@textguard/plugin-pii`, installs that tarball into a clean temporary git project, runs `textguard-pii init`, and verifies:

- non-allowlisted PII blocks a real commit;
- allowlisted values and ignored paths permit the intended commit;
- the CI scanner accepts policy-approved changes;
- the CI scanner rejects a non-allowlisted leak.

This protects the consumer setup path from regressing even when the monorepo itself still builds successfully.

## Consumer DX still in progress

The remaining step is the final public documentation pass after the external E2E check is green. At that point M0.6 can be marked complete.

Detection and policy remain separate: detectors report findings; the PII policy layer decides whether an intentional finding should block.

## License

MIT
