# @textguard/plugin-pii

**Stop PII from ever reaching a commit, a pull request, or a log file.**

Part of [TextGuard](https://github.com/AshkanAhmady/textguard) — catches email addresses, phone numbers, credit card numbers, and IBANs _before_ they end up somewhere they shouldn't, with a pre-commit hook and a GitHub Action ready out of the box.

[![npm version](https://img.shields.io/npm/v/%40textguard%2Fplugin-pii.svg)](https://www.npmjs.com/package/@textguard/plugin-pii)
[![license](https://img.shields.io/npm/l/%40textguard%2Fplugin-pii.svg)](https://github.com/AshkanAhmady/textguard/blob/main/LICENSE)

---

## Why this exists

A developer pastes a real customer email into a test fixture. A support agent copies a phone number into a commit message. A credit card number slips into a debug log that gets committed by accident. None of this is malicious — it's just how PII actually leaks into source control, and once it's in git history, it's expensive to get out. Under GDPR/PCI-DSS, that's not a hypothetical risk, it's a compliance incident.

`@textguard/plugin-pii` catches it **before** it's committed, and **before** it's merged — not after, in a security audit six months later.

## What it detects

| Type                | Validated          |
| ------------------- | ------------------ |
| Email addresses     | —                  |
| Phone numbers       | —                  |
| Credit card numbers | ✅ Luhn checksum   |
| IBAN                | ✅ mod-97 checksum |

Credit card and IBAN matches are checksum-validated, so a random 16-digit number won't trigger a false positive — only numbers that are actually structurally valid.

---

## Install

```bash
npm install @textguard/plugin-pii
# or: pnpm add @textguard/plugin-pii
```

Everything below assumes you've installed this as a normal dependency in **your own project** — not that you're working inside the TextGuard monorepo itself. (If you are working inside this monorepo, see [Contributing / monorepo usage](#contributing--monorepo-usage) at the bottom — the paths are different there.)

## Quick start (library)

```ts
import { scanText } from "@textguard/plugin-pii";

const result = scanText("Contact me at hello@example.com");

result.clean; // false
result.findings; // [{ type: "email", matchedText: "hello@example.com", start: 14, end: 32 }]
```

```ts
import { scanMany } from "@textguard/plugin-pii";

scanMany(["clean line", "call +989121234567"]);
```

## Block it at commit time

Installing the package also installs a `textguard-pii` CLI (via `npx`) that scans every staged file and blocks the commit if it finds PII.

**Using Husky:**

```bash
npx husky init   # if you don't already have husky set up
```

Add to `.husky/pre-commit`:

```sh
npx textguard-pii
```

Emergency bypass (not recommended): `git commit --no-verify`.

## Block it at PR time

The package also installs a `textguard-pii-ci` CLI, meant for CI. Add this workflow to `.github/workflows/pii-scan.yml` in **your own repo**:

```yaml
name: PII Scan

on:
  pull_request:

jobs:
  pii-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0 # needed so the base..head diff works

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - run: npm install @textguard/plugin-pii

      - run: >
          npx textguard-pii-ci
          --base ${{ github.event.pull_request.base.sha }}
          --head ${{ github.sha }}
```

You'll get:

- Inline `::error` annotations directly on the offending line in the "Files changed" tab
- A markdown summary table posted to the job's Actions summary page

No PII, no red X, no reviewer has to catch it by eye.

## Reporting

The same formatter powers both surfaces, so console output and the CI summary never drift apart:

```ts
import {
  scanText,
  toFileResult,
  formatConsoleReport,
  formatMarkdownReport,
} from "@textguard/plugin-pii";

const content = "hello@example.com";
const result = toFileResult("notes.txt", content, scanText(content));

formatConsoleReport([result]); // terminal-friendly
formatMarkdownReport([result]); // markdown table
```

## What's not in v1 (yet)

- No org-wide dashboard or multi-repo reporting — that's planned, not built.
- No `explain()`-quality "why this matched, here's how to fix it" output yet — currently just position + type. Depends on TextGuard core's Explain API landing first.
- UUID detection intentionally left out — a bare UUID rarely has compliance weight on its own.

See `TEXTGUARD-ROADMAP.md` in the main repo, Epic 0, for what's next.

---

## Contributing / monorepo usage

If you're working inside the `textguard` monorepo itself (not consuming the published package), the CLI and CI scripts live at:

```bash
pnpm --filter @textguard/plugin-pii build
node packages/plugins/pii/dist/cli.js   # pre-commit
node packages/plugins/pii/dist/ci.js --base <ref> --head <ref>   # CI
```

This repo's own `.husky/pre-commit` and `.github/workflows/pii-scan.yml` use these paths directly, since they're dogfooding this package from source rather than from the published npm registry.

## License

MIT
