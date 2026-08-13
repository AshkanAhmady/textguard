# Adoption validation

TextGuard uses adoption evidence to choose product work after the current CLI, VS Code, and Playground integration milestone.

## Living signal log

GitHub issue #65 is the canonical living log for adoption signals. Link underlying feedback instead of copying large reports into the log.

## Signals

Review these signals together:

- structured GitHub issues for runtime bugs, detection quality, DX friction, and feature requests;
- npm usage trends for public TextGuard packages;
- VS Code Marketplace install and rating changes;
- Playground usage or shared examples when observable;
- repeated requests for the same integration, detector, language, or API surface.

A single issue is evidence, not automatic roadmap priority.

## Triage cadence

Review the signal log after meaningful new feedback arrives and at least once before starting a new product integration. No code change is required when the evidence is still weak.

When a pattern becomes actionable:

1. link the supporting signals in issue #65;
2. open a narrowly scoped milestone issue;
3. state the user problem and success criterion before implementation;
4. update `docs/textguard-roadmap.md` in the implementation PR;
5. keep runtime/core API changes separate from integration-only work unless the evidence requires a shared API.

## Integration decision rule

Chrome, AI, or another integration should not be promoted merely because it is technically possible. Prefer the smallest integration or library change that addresses a repeated or high-impact consumer need while preserving existing public APIs and package boundaries.
