# @textguard/plugin-pii

PII / compliance detection bundle for TextGuard — catches email addresses, phone numbers, credit card numbers, and IBANs before they end up in a commit, log, or production output.

> **Status: v0.1.0 — scan core + pre-commit hook + GitHub Action.**

## Install

```bash
pnpm add @textguard/plugin-pii
```

## Usage

```ts
import { scanText } from "@textguard/plugin-pii";

const result = scanText("Contact me at hello@example.com");

console.log(result.clean); // false
console.log(result.findings); // [{ type: "email", matchedText: "hello@example.com", start: 14, end: 32 }]
```

Scanning multiple inputs at once (e.g. every changed line in a diff):

```ts
import { scanMany } from "@textguard/plugin-pii";

const results = scanMany(["clean line", "call +989121234567"]);
```

## Pre-commit hook (CLI)

The package ships a `textguard-pii` CLI that scans every staged file's committed content and blocks the commit if PII is found:

```bash
node packages/plugins/pii/dist/cli.js
```

This is wired into the repo's root `.husky/pre-commit` hook already — it runs automatically on every `git commit` alongside the existing `lint-staged` and `pnpm lint` steps. Rebuild the package (`pnpm --filter @textguard/plugin-pii build`) after any change to its source, since the hook runs the built `dist/cli.js`, not the TypeScript source directly.

To bypass in an emergency (not recommended): `git commit --no-verify`.

## GitHub Action (CI)

`.github/workflows/pii-scan.yml` runs on every pull request: it diffs `base`..`head`, scans every changed file's content at `head`, and fails the check with inline annotations if PII is found. This is the first GitHub Actions workflow in this repo — there wasn't one before, despite older planning docs listing "GitHub Actions" as done.

## What's included in v1

- Email
- Phone
- Credit card (Luhn-validated)
- IBAN (mod-97 validated)

UUID was deliberately left out — a bare UUID rarely has compliance weight on its own.

## Roadmap

See `TEXTGUARD-ROADMAP.md` in the main repo, Epic 0. Pre-commit hook (M0.3) and GitHub Action (M0.4) modes are next.
