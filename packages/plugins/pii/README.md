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

- creates `.husky/pre-commit` with `npx textguard-pii` when the hook does not exist;
- appends the command when a pre-commit hook already exists;
- leaves an already-configured hook unchanged;
- creates `.github/workflows/pii-scan.yml` when no workflow exists at that path;
- never overwrites an existing PII workflow file.

Husky itself must already be installed/initialized in the consuming project for `.husky/pre-commit` to run. Automatic Husky dependency/setup handling is part of the remaining Consumer DX work.

## Library usage

```ts
import { scanText } from "@textguard/plugin-pii";

const result = scanText("Contact: hello@example.com");

result.clean; // false
result.findings;
```

## Manual pre-commit setup

If you prefer manual setup, add this to `.husky/pre-commit`:

```sh
npx textguard-pii
```

## Manual CI setup

The `textguard-pii-ci` executable scans a git diff and exits non-zero when PII is found:

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

## Consumer DX still in progress

The next PII hardening steps are:

- verify `init` end-to-end from a clean external project;
- make Husky setup smoother;
- add policy configuration for allowlisted values, ignored paths/globs, and narrowly scoped suppressions;
- verify commit and PR blocking end-to-end.

Detection and policy will remain separate: detectors report findings; the PII policy layer will decide whether an intentional finding should block.

## License

MIT
