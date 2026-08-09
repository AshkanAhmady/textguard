# ADR-007: Safe PII consumer initialization

## Status
Accepted

## Context

Installing `@textguard/plugin-pii` exposes scanners, but consumers still have to manually wire pre-commit and pull-request enforcement. That gap makes the package appear installed while providing no automatic protection.

## Decision

Expose `npx textguard-pii init` as the supported setup entry point. The initializer may add TextGuard's pre-commit command to an existing Husky hook, but must preserve existing hook commands. It may create the standard PII GitHub Actions workflow when the target path does not exist, but must never overwrite an existing workflow file.

The initializer does not silently install or initialize Husky in this step. Policy configuration (allowlists, ignored paths/globs, suppressions) remains a separate follow-up layer and must not weaken the underlying detectors.

## Consequences

- consumer setup becomes discoverable and repeatable;
- repeated `init` calls are safe/idempotent for the pre-commit command;
- existing CI configuration is protected from destructive overwrite;
- full end-to-end setup still requires later Husky handling and policy configuration work.
