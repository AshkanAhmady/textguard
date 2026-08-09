# TextGuard Package README Audit

> Source of truth for the README standardization pass. Audit performed against the published package surface and updated as cleanup PRs land.

## Scope

This audit covers published TextGuard packages only. Internal workspace packages such as `@repo/eslint-config` and `@repo/typescript-config` are private and are not part of the npm-facing README cleanup.

Quality bar: use `@textguard/plugin-pii` as the reference for structure and developer usability: clear purpose, install command, copy/paste quick start, current API, options/limitations where relevant, and a short license section.

## Summary

| Package | Current state | Priority | Main issue |
| --- | --- | --- | --- |
| `@textguard/all` | ✅ Rewritten | P0 | Main bundle README now documents install, quick start, presets, exports, Explain/Debug, and current limitations. |
| `@textguard/core` | ✅ Good | P2 | Current and useful; only consistency polish may be needed later. |
| `@textguard/plugin-pii` | ✅ Reference | P2 | Current quality reference; no rewrite needed now. |
| `@textguard/plugin-fa` | ✅ Corrected | P0 | Current `dictionaries`/filter API documented; malformed markdown and removed APIs are gone. |
| `@textguard/plugin-en` | ✅ Corrected | P0 | Current `dictionaries`/filter API documented; leetspeak setup is explicit rather than implied automatic. |
| `@textguard/plugin-ar` | 🟡 Usable but thin | P2 | Current API shape is closer to reality, but package status/capability wording needs alignment with the lower-priority Arabic parity plan. |
| `@textguard/plugin-email` | 🟡 Minimal | P1 | Valid basic usage, but too thin and includes literal PII-like sample data that can conflict with repository scans. |
| `@textguard/plugin-url` | 🟡 Mostly usable | P1 | Better than most detection READMEs, but needs standardized structure and examples. |
| `@textguard/plugin-phone` | ✅ Corrected | P0 | Now demonstrates phone detection with the current plugin API and documents format-detection limitations. |
| `@textguard/plugin-ip` | ✅ Corrected | P0 | Now demonstrates IP detection instead of copied email examples. |
| `@textguard/plugin-uuid` | ✅ Corrected | P0 | Now demonstrates UUID detection instead of copied email examples. |
| `@textguard/plugin-credit-card` | ✅ Corrected | P0 | Uses the real `creditCardPlugin()` API and documents Luhn validation accurately. |
| `@textguard/plugin-iban` | ✅ Corrected | P0 | Demonstrates IBAN detection and documents mod-97 validation accurately. |

## Confirmed problems

### P0 — corrected

1. ✅ `@textguard/all` no longer ships an empty README.
2. ✅ Persian and English READMEs now use current APIs and valid markdown.
3. ✅ Phone, IP, UUID, Credit Card, and IBAN READMEs now use detector-specific examples.
4. ✅ Credit Card documentation now uses the valid `creditCardPlugin()` export and explains Luhn validation.
5. ✅ IBAN documentation now explains mod-97 validation instead of describing the detector as regex-only.

### P1 — next

- Email README works as a minimal example but lacks the standard package structure.
- URL README is usable but should be normalized to the same concise format as the rest of the package family.
- Detection examples should avoid raw PII literals where repository PII scans would flag the documentation itself; build examples from safe fragments when needed.

### P2 — polish / later

- Core README is already current and useful.
- PII README is the reference format.
- Arabic README is usable for the current thin package, but final capability wording should be revisited together with Arabic parity rather than pretending parity already exists.

## Standard README template

Each published package should normally contain, in this order:

1. Package name + one-sentence purpose.
2. Installation.
3. Minimal copy/paste quick start using the current API.
4. What the package detects/provides.
5. Important validation behavior or limitations.
6. Relevant exports/options only when useful.
7. Related package/example links when they reduce onboarding friction.
8. License.

Keep examples short. Do not add architecture details that ordinary consumers do not need.

## Rewrite sequence

1. ✅ `@textguard/all` — completed.
2. ✅ `@textguard/plugin-fa` and `@textguard/plugin-en` — completed.
3. ✅ Detection P0 group — Phone, IP, UUID, Credit Card, IBAN.
4. **Next:** Detection P1 group — Email and URL.
5. Arabic README consistency pass without expanding Arabic implementation scope.
6. Final consistency check across Core, PII, All, language, and detection packages.

## Definition of done

README standardization is complete when every published TextGuard package has a non-empty README, every code sample matches shipped public APIs, detector descriptions match implementation/validation behavior, examples are simple enough for a normal npm consumer, and the repository PII scan remains green without hiding real documentation mistakes behind broad ignores.
