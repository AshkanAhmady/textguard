# Adoption validation

TextGuard uses adoption evidence to choose product work after the current CLI, VS Code, and Playground integration milestone. `PRODUCT-GROWTH-PLAN.md` defines the wider product-growth sequence; this document defines how evidence is collected and promoted into work.

## Living signal log

GitHub issue #65 is the canonical living log for adoption signals. Link underlying feedback instead of copying large reports into the log.

## Signals

Review these signals together:

- structured GitHub issues for runtime bugs, detection quality, DX friction, feature requests, and user workflows;
- npm usage trends for public TextGuard packages;
- VS Code Marketplace install and rating changes;
- Playground usage or shared examples when observable;
- optional survey/feedback responses describing why a developer installed TextGuard and what workflow they are solving;
- direct conversations with early adopters;
- repeated requests for the same integration, detector, language, policy, or API surface.

A single issue is evidence, not automatic roadmap priority. Download counts alone do not explain user intent.

## Learning questions

When collecting feedback, prioritize these questions:

1. What problem caused the developer to look for TextGuard?
2. Which TextGuard package/integration did they adopt?
3. Where in their workflow is it used: runtime, validation, CI, pre-commit, editor, or another surface?
4. Which capability produced the most value?
5. What prevented or slowed adoption?
6. What missing capability would materially improve the workflow?
7. Is the problem individual-developer pain or team/organization pain?

Prefer explicit, privacy-respecting feedback over invasive library telemetry. Do not add runtime telemetry to Core solely for product analytics. If lightweight analytics are later added to a website or Playground, keep them separate from package runtime behavior and document them clearly.

## Triage cadence

Review the signal log after meaningful new feedback arrives and at least once before starting a new product integration. No code change is required when the evidence is still weak.

During active launch/distribution, review the signal log and quantitative trends on a regular cadence so feedback is not lost, but do not convert normal metric noise into feature work.

When a pattern becomes actionable:

1. link the supporting signals in issue #65;
2. open a narrowly scoped milestone issue;
3. state the user problem and success criterion before implementation;
4. update `docs/textguard-roadmap.md` in the implementation PR;
5. keep runtime/core API changes separate from integration-only work unless the evidence requires a shared API.

## Integration decision rule

Chrome, AI, paid-team capabilities, framework adapters, or another integration should not be promoted merely because they are technically possible. Prefer the smallest integration or library change that addresses a repeated or high-impact consumer need while preserving existing public APIs and package boundaries.

Commercial infrastructure such as billing, authentication, dashboards, or organization administration should follow validated commercial demand rather than being built in advance of it.
