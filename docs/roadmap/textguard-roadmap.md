# TextGuard Roadmap

Version: 2.0
Status: Active

---

# Vision

TextGuard aims to become the most extensible text processing platform for JavaScript and TypeScript.

Its purpose is to help developers **catch problems before production** by analyzing, explaining and improving application text.

TextGuard is the first product of the Guard Ecosystem.

---

# Mission

Build a production-grade developer platform that prevents text-related issues before deployment while providing excellent Developer Experience.

---

# Product Philosophy

- Infrastructure, not just a profanity filter.
- Developer Experience is a first-class feature.
- Architecture before implementation.
- Documentation grows with the code.
- Every feature must provide real value.

---

# Development Principles

- Catch problems before production.
- Infrastructure before UI.
- No half-built features.
- Small reviewable commits.
- Stable public APIs.
- Extensibility over shortcuts.

---

# Current Project Status

Current Phase: Phase 7

Current Epic: Debug Engine

Current Milestone: Milestone 1 — Debug Foundation

Next Commit:

```text
feat(core): add debug engine foundation
```

---

# Completed Phases

## Phase 1 — Foundation ✅

- Research
- Architecture
- pnpm Workspace
- TurboRepo
- Changesets

## Phase 2 — Core Engine ✅

- createFilter()
- Rule Engine
- Dictionary Engine
- Plugin Engine
- Pipeline

## Phase 3 — Official Plugins ✅

Languages:

- Persian
- English
- Arabic

Detection:

- Email
- URL
- Phone
- IP
- UUID
- Credit Card
- IBAN

## Phase 4 — Productization ✅

- @textguard/all
- Presets
- Examples
- ESM / CJS
- Tree Shaking

## Phase 5 — Quality ✅

- Tests
- Coverage
- README
- GitHub Actions
- CI
- npm Release

## Phase 6 — Developer Experience ✅

- Public API Review
- Dependency Cleanup
- Build Review
- Example Applications

---

# Phase 7 — Advanced Features

## Epic 1 — Debug Engine

Milestone 1

- DebugSession
- DebugEvent
- DebugCollector
- filter.debug()
- toJSON()

Milestone 2

- Console Renderer
- Markdown Renderer
- HTML Renderer

Milestone 3

- Timeline

Milestone 4

- Performance Diagnostics

Milestone 5

- Explain API

Milestone 6

- VS Code Integration
- Chrome Integration
- Website Playground
- AI Integration

## Epic 2 — Enterprise Preset

- JWT
- API Keys
- Secrets
- Tokens
- Wallets
- SSH Keys

## Epic 3 — Benchmark Suite

- Speed
- Memory
- Bundle Size

## Epic 4 — VS Code Extension

## Epic 5 — Chrome Extension

## Epic 6 — AI Platform

Package:

```text
@textguard/plugin-ai
```

Features:

- AI Analysis
- Rewrite
- Suggestions
- Translation Review
- UX Review
- Prompt Review
- Prompt Injection Detection
- Jailbreak Detection
- Brand Voice
- Speech Moderation

---

# Definition of Done

TextGuard is complete when:

- Debug Engine is finished.
- Explain API is finished.
- Enterprise Preset is finished.
- Benchmark Suite is finished.
- VS Code Extension is released.
- Chrome Extension is released.
- AI Platform is released.

After that only bug fixes, improvements and new plugins should be added.

---

# Beyond TextGuard

Guard Ecosystem:

- SchemaGuard
- ApiGuard
- GitGuard
- ConfigGuard
- FormGuard

Mission:

Catch problems before production.

---

# Development Workflow

Design

↓

Architecture

↓

Implementation

↓

Tests

↓

Documentation

↓

Commit

---

# Commit Rules

Every commit must:

- Add user value
- Improve Developer Experience
- Increase the product's commercial value

---

# Long-Term Vision

TextGuard should become the Grammarly for developer text.
