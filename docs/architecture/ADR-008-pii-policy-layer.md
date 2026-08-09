# ADR-008 — PII Policy Layer

## Status

Accepted for PII Consumer DX hardening.

## Context

PII detectors answer whether text structurally matches an email, phone number, credit card, or IBAN. Consumer repositories also need intentional exceptions for test fixtures, documentation, and other known-safe values. Encoding those exceptions inside detectors would weaken detection semantics and make policy impossible to reason about consistently across library, pre-commit, and CI usage.

## Decision

Keep detection and enforcement policy separate.

- `scanText(text)` remains detection-only and backward compatible.
- `scanFile(path, text, config)` applies consumer policy after detection.
- `textguard-pii.config.json` is the repository-level policy source for CLI and CI.
- `allowlist` is detector-specific and exact-value based.
- `ignorePaths` uses path/glob matching and suppresses all findings in a matching file.
- `suppressions` are narrower exceptions that can constrain path, detector type, and exact matched value.
- Pre-commit and CI load the same policy configuration so local and remote enforcement do not drift.

## Consequences

The detector layer stays strict and reusable. Consumer exceptions become explicit, reviewable repository policy. Broad ignored paths remain possible but documentation should recommend the narrowest exception that solves the use case.
