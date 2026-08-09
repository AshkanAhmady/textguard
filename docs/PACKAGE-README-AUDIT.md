# TextGuard Package README Audit

> Source of truth for the completed README standardization pass. Audit performed against the published package surface and checked against shipped APIs/exports.

## Scope

This audit covers published TextGuard packages only. Internal workspace packages such as `@repo/eslint-config` and `@repo/typescript-config` are private and are not part of the npm-facing README cleanup.

Quality bar: use `@textguard/plugin-pii` as the reference for developer usability: clear purpose, install command, copy/paste quick start, current API, options/limitations where relevant, and a short license section.

## Final status

| Package | Status | Verification |
| --- | --- | --- |
| `@textguard/all` | ✅ Complete | Install, quick start, presets, exports, Explain/Debug, and current limitations documented. |
| `@textguard/core` | ✅ Complete | Current filter API, plugin usage, Explain, Debug, options, and design boundaries documented. |
| `@textguard/plugin-pii` | ✅ Complete / reference | Consumer setup, `init`, policy exceptions, CLI/CI, detection scope, and E2E validation documented. |
| `@textguard/plugin-fa` | ✅ Complete | Current dictionary API and optional normalization mapping documented. |
| `@textguard/plugin-en` | ✅ Complete | Current dictionary API and optional leetspeak mapping documented. |
| `@textguard/plugin-ar` | ✅ Accurate for current state | Published foundation state and real exports documented without claiming implementation parity. |
| `@textguard/plugin-email` | ✅ Complete | Current API, safe example, and detection limitation documented. |
| `@textguard/plugin-url` | ✅ Complete | Current API, concise example, and detection limitation documented. |
| `@textguard/plugin-phone` | ✅ Complete | Detector-specific example and format-detection limitations documented. |
| `@textguard/plugin-ip` | ✅ Complete | Detector-specific example documented. |
| `@textguard/plugin-uuid` | ✅ Complete | Detector-specific example documented. |
| `@textguard/plugin-credit-card` | ✅ Complete | Current plugin API and Luhn validation documented. |
| `@textguard/plugin-iban` | ✅ Complete | Current plugin API and mod-97 validation documented. |

## Final consistency result

README standardization is **complete** for the current published package surface.

The final pass confirms:

- every published package has a non-empty developer-facing README;
- package examples use shipped public APIs rather than stale interfaces;
- detector claims match current validation behavior;
- Core documents the current Debug and Explain surfaces;
- PII documents explicit allowlist/ignore/suppression policy instead of encouraging broad scanner bypasses;
- Arabic documentation accurately describes its current foundation-only implementation rather than implying Persian/English parity;
- examples remain intentionally short and npm-consumer oriented.

No runtime/API change is part of this documentation milestone.

## Standard for future packages

New published packages should normally contain, in this order:

1. Package name + one-sentence purpose.
2. Installation.
3. Minimal copy/paste quick start using the current API.
4. What the package detects/provides.
5. Important validation behavior or limitations.
6. Relevant exports/options only when useful.
7. Related package/example links when they reduce onboarding friction.
8. License.

Keep examples short. Do not add architecture details ordinary consumers do not need. Any future public API or behavior change must update its affected README in the same PR.

## Completed rewrite sequence

1. ✅ `@textguard/all`.
2. ✅ `@textguard/plugin-fa` and `@textguard/plugin-en`.
3. ✅ Detection P0 — Phone, IP, UUID, Credit Card, IBAN.
4. ✅ Detection P1 — Email and URL.
5. ✅ Arabic README consistency.
6. ✅ Final package-wide consistency check — Core, PII, All, language, and detection packages.

## Next product step

README cleanup is closed. The next planned product-quality milestone is **Arabic implementation parity**, kept separate from this documentation-only work.
