# ADR-011: Prefer Specialist Structured Detectors on Exact Overlap

## Status

Accepted for the Quality Hardening phase.

## Context

TextGuard can detect the same source span through more than one rule. The Persian aggregate dictionary includes privacy regex entries for structured data such as email addresses and Iranian phone numbers, while the strict preset also registers dedicated structured detector plugins.

Core overlap resolution intentionally treats a lower numeric `Rule.priority` as stronger precedence. Dictionary rules use priority `100`, while the official structured detector rules previously used priority `200`. For an equal-span email or phone match, the generic dictionary rule therefore won even though a specialist detector had also recognized the value.

The final filtering decision was still a match, but Debug and Explain attributed it to the `dictionary` plugin. This made provenance misleading and hid the detector-specific rule/category from developers.

## Decision

Official structured-data detector rules use priority `50`, ahead of the generic dictionary priority `100`.

Core's generic overlap algorithm is unchanged. It remains deterministic and plugin-agnostic:

1. prefer the longer overlapping match;
2. for equal lengths, prefer the lower numeric rule priority;
3. retain the existing deterministic plugin/rule tie-breakers.

The detector packages express their specialist status through ordinary rule metadata rather than Core hard-coding knowledge of official plugin names.

This precedence is applied consistently to the official Email, URL, Phone, IP, UUID, Credit Card, and IBAN detectors so future aggregate dictionaries cannot unexpectedly steal exact-span provenance from a specialist detector.

## Consequences

### Positive

- Explain and Debug identify the owning structured detector for equal-span overlaps;
- Core remains generic and extensible for third-party plugins;
- aggregate language dictionaries can retain their existing privacy-pattern behavior;
- direct detector behavior and validation remain unchanged;
- custom rules can still deliberately outrank official detectors by choosing a lower numeric priority.

### Tradeoffs

- rule priority is observable metadata, so detector packages receive patch releases;
- a specialist detector now wins an equal-length conflict even when a generic dictionary entry has a different category or severity;
- overlap policy still depends on rule authors choosing priorities intentionally.

## Guardrails

- do not special-case plugin names in Core overlap resolution;
- do not remove privacy patterns from public aggregate dictionaries solely to fix provenance;
- add preset-level regression tests whenever multiple official surfaces can detect the same source span;
- validators on specialist detectors continue to decide whether that detector participates; an invalid structured-data candidate must not suppress an independently valid dictionary match;
- priority changes that alter winner selection require release notes and consumer revalidation.
