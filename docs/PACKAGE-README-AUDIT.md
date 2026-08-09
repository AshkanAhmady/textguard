# TextGuard Package README Audit

> Source of truth for the README standardization pass. Audit performed against the published package surface and updated as cleanup PRs land.

## Scope

This audit covers published TextGuard packages only. Internal workspace packages such as `@repo/eslint-config` and `@repo/typescript-config` are private and are not part of the npm-facing README cleanup.

Quality bar: use `@textguard/plugin-pii` as the reference for structure and developer usability: clear purpose, install command, copy/paste quick start, current API, options/limitations where relevant, and a short license section.

## Summary

| Package | Current state | Priority | Main issue |
| --- | --- | --- | --- |
| `@textguard/all` | ✅ Rewritten | P0 | Main bundle README documents install, quick start, presets, exports, Explain/Debug, and current limitations. |
| `@textguard/core` | ✅ Good | P2 | Current and useful; verify consistency in the final pass. |
| `@textguard/plugin-pii` | ✅ Reference | P2 | Current quality reference; verify consistency in the final pass. |
| `@textguard/plugin-fa` | ✅ Corrected | P0 | Current API and optional normalization mapping documented. |
| `@textguard/plugin-en` | ✅ Corrected | P0 | Current API and optional leetspeak mapping documented. |
| `@textguard/plugin-ar` | ✅ Accurate for current state | P2 | README now explicitly documents the published foundation state: empty dictionary/pack and real `arLanguage` export; implementation parity remains separate work. |
| `@textguard/plugin-email` | ✅ Corrected | P1 | Standard structure, current API, safe copy/paste example, and detection limitation documented. |
| `@textguard/plugin-url` | ✅ Corrected | P1 | Standard structure, current API, concise example, and detection limitation documented. |
| `@textguard/plugin-phone` | ✅ Corrected | P0 | Detector-specific example and format-detection limitations documented. |
| `@textguard/plugin-ip` | ✅ Corrected | P0 | Detector-specific example documented. |
| `@textguard/plugin-uuid` | ✅ Corrected | P0 | Detector-specific example documented. |
| `@textguard/plugin-credit-card` | ✅ Corrected | P0 | Real API and Luhn validation documented accurately. |
| `@textguard/plugin-iban` | ✅ Corrected | P0 | IBAN detection and mod-97 validation documented accurately. |

## Remaining work

Only the final package-wide consistency check remains. That pass should verify every published package README against the shipped exports/API, remove any remaining stale wording, and confirm the repository PII scan remains green.

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
4. ✅ Detection P1 group — Email and URL.
5. ✅ Arabic README consistency pass — current implementation described accurately without expanding feature scope.
6. **Next:** final consistency check across Core, PII, All, language, and detection packages.

## Definition of done

README standardization is complete when every published TextGuard package has a non-empty README, every code sample matches shipped public APIs, detector descriptions match implementation/validation behavior, examples are simple enough for a normal npm consumer, and the repository PII scan remains green without hiding real documentation mistakes behind broad ignores.
