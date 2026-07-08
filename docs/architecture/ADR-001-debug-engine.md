# ADR-001 — Debug Engine

Status: Accepted

Date: 2026-07-08

---

## Context

TextGuard has evolved from a simple profanity filter into a complete text-processing platform.

As the number of plugins, rules, normalization steps and AI-powered features grows, developers need visibility into how the engine processes text.

Traditional debugging using console.log() is insufficient because:

- Multiple plugins participate in a single execution.
- Rules may execute conditionally.
- Normalization changes the input before matching.
- AI features will require access to execution history.
- Future tools (VS Code, Chrome Extension, CLI, Website Playground) must share the same execution information.

For these reasons, a dedicated Debug Engine is introduced.

---

## Problem

Developers currently have no way to answer questions such as:

- Why wasn't this word matched?
- Which plugin detected this result?
- Which normalization step changed the text?
- How much time did each plugin consume?
- Why did a rule execute?
- Which rule generated the match?

Without structured debugging information, troubleshooting becomes difficult and expensive.

---

## Decision

TextGuard will introduce a dedicated Debug Engine.

The Debug Engine is considered infrastructure rather than a feature.

Every execution performed by TextGuard may produce a structured Debug Session.

Renderers, Explain API, AI integrations and future developer tools will consume this Debug Session instead of implementing their own debugging logic.

---

## Architecture

The Debug Engine follows an event-driven architecture.

Instead of producing formatted output directly, the engine records every important step of the processing pipeline as structured events.

A Debug Session is created for every debug execution.

The Debug Session contains:

- Original input
- Pipeline events
- Collected matches
- Performance information
- Metadata

The Debug Session itself contains no presentation logic.

Different renderers consume the same Debug Session to produce different outputs such as:

- JSON
- Console
- Markdown
- HTML

Future integrations such as the VS Code Extension, Chrome Extension, CLI, Website Playground and AI Platform will also consume the same Debug Session.

---

## Diagram

                 filter.debug(text)

                         │

                         ▼

                 Debug Engine

                         │

               Creates DebugSession

                         │

        ┌────────────────┼────────────────┐

        ▼                ▼                ▼

     Events          Matches        Performance

        │

        ▼

     Renderers

┌──────────┬──────────┬──────────┬──────────┐

│ JSON │ Console │ Markdown │ HTML │

└──────────┴──────────┴──────────┴──────────┘

                         │

                  Future Consumers

        ┌──────────┬──────────┬──────────┬──────────┐

        │ Explain  │ VSCode   │ Chrome   │ AI       │

        └──────────┴──────────┴──────────┴──────────┘

---

## Core Principles

### Event Driven

Everything that happens inside the pipeline should be represented as an event.

---

### Renderer Agnostic

The Debug Engine never formats output.

Formatting is the responsibility of renderers.

---

### Immutable

A Debug Session becomes immutable after execution.

---

### AI Ready

AI features must consume the same Debug Session without requiring additional processing.

---

### Extensible

New events, renderers and integrations can be added without modifying existing components.

---

### Low Overhead

When debugging is disabled, the engine should introduce near-zero runtime overhead.

---

## Debug Flow

Input

    │

    ▼

Pipeline Started

    │

    ▼

Normalization

    │

    ▼

Plugins

    │

    ▼

Rules

    │

    ▼

Matches

    │

    ▼

Output

    │

    ▼

Pipeline Finished

---

## Domain Model

The Debug Engine is composed of a small set of domain objects.

Each object has a single responsibility.

The engine should remain modular and easy to extend.

### Main Components

- DebugSession
- DebugEvent
- Timeline
- PerformanceReport
- DebugRenderer

Each component is described below.

---

### DebugSession

The DebugSession represents a complete execution of the TextGuard pipeline.

It is the root object of the Debug Engine.

A DebugSession is created whenever `filter.debug()` is executed.

Responsibilities:

- Store original input
- Store normalized input
- Store all emitted events
- Store matches
- Store execution metadata
- Store performance information

A DebugSession is immutable after execution.

### DebugEvent

A DebugEvent represents a single action performed during pipeline execution.

Every meaningful operation inside TextGuard emits an event.

Examples include:

- Pipeline Started
- Normalization Started
- Plugin Started
- Rule Executed
- Match Found
- Pipeline Finished

Events are ordered chronologically.

### Timeline

The Timeline is a chronological projection of all Debug Events.

Its purpose is visualization.

The Timeline contains no business logic.

Different renderers may visualize the Timeline differently.

### Performance Report

The Performance Report aggregates execution metrics.

Examples:

- Total duration
- Plugin duration
- Rule duration
- Normalization duration

The report is generated from collected Debug Events.

### DebugRenderer

Renderers transform a DebugSession into human-readable output.

Renderers never execute pipeline logic.

They only consume DebugSession data.

Official renderers include:

- JSON
- Console
- Markdown
- HTML

                    DebugSession
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
       Events         Timeline      Performance
          │
          ▼

  DebugRenderer
  │
  ┌──────┼──────┬──────┬──────┐
  ▼ ▼ ▼ ▼
  JSON Console Markdown HTML

---

## Responsibilities

| Component         | Responsibility                                   |
| ----------------- | ------------------------------------------------ |
| DebugSession      | Root object containing the entire execution      |
| DebugEvent        | Represents one action performed during execution |
| Timeline          | Visual chronological representation              |
| PerformanceReport | Execution metrics                                |
| DebugRenderer     | Output formatting                                |

---

## Public API

The Debug Engine is exposed through the existing Filter instance.

Example:

```ts
const filter = createFilter(strictPreset);

const debug = filter.debug(text);
```

The returned object is a DebugSession.

The DebugSession exposes different renderers without exposing internal implementation details.

Examples:

```ts
debug.toJSON();

debug.toConsole();

debug.toMarkdown();

debug.toHTML();
```

Additional APIs may be introduced in future versions without breaking compatibility.

Examples:

```ts
debug.timeline();

debug.performance();

debug.events();
```

The public API intentionally remains small while exposing enough information for advanced debugging.

### API Design Principles

The public API follows these principles:

- Small surface area
- Strong typing
- Immutable results
- No renderer-specific logic
- Stable long-term API
- Backward compatibility whenever possible

### Example

```ts
const filter = createFilter(strictPreset);

const debug = filter.debug(text);

debug.toConsole();

const json = debug.toJSON();

const markdown = debug.toMarkdown();
```

### Future Extensions

The DebugSession is intentionally designed to support future capabilities.

Potential future APIs include:

- explain()
- export()
- share()
- timeline()
- performance()
- serialize()

These APIs should be implemented without redesigning the Debug Engine.

---

## Event Catalog

Every important action performed by TextGuard should emit a Debug Event.

Events are chronological.

Events never mutate previous events.

Each event represents a fact that happened during execution.

### Pipeline Events

- PipelineStarted
- PipelineFinished

### Normalization Events

- NormalizationStarted
- NormalizationFinished

### Dictionary Events

- DictionaryLoaded
- DictionaryMatched

### Plugin Events

- PluginStarted
- PluginFinished
- PluginSkipped

### Rule Events

- RuleStarted
- RuleMatched
- RuleFinished

### Match Events

- MatchFound
- MatchRejected

### Output Events

- MaskApplied
- ReplaceApplied
- OutputGenerated

### Performance Events

Performance information should be generated from existing events.

No dedicated timing events are required.

Each event may optionally include timestamps.

This allows renderers to compute execution metrics without changing the pipeline.

---

## Event Design Rules

Every event should satisfy the following rules:

- Immutable
- Chronological
- Serializable
- Strongly typed
- Self-contained

Events should never contain presentation logic.

Events should contain only execution facts.

---

## Future Consumers

The Event Catalog is the foundation for future developer tools.

Consumers include:

- Explain API
- Console Renderer
- Markdown Renderer
- HTML Renderer
- VS Code Extension
- Chrome Extension
- CLI
- GuardEcosystem Website Playground
- AI Platform

All future tools should consume events instead of directly interacting with the pipeline.

---

## Alternatives Considered

During the design of the Debug Engine, several alternative approaches were evaluated.

### Direct Console Logging

Rejected.

Logging directly from the pipeline tightly couples execution logic with presentation.

It also prevents reuse by future tools such as the VS Code Extension, Chrome Extension and AI Platform.

---

### Returning Debug Information Directly

Rejected.

Returning raw debugging data from every pipeline method would pollute the public API and increase maintenance costs.

Instead, debugging is exposed through a dedicated `filter.debug()` execution.

---

### Renderer-specific Debug Logic

Rejected.

Each renderer should only transform existing DebugSession data.

Business logic must never exist inside renderers.

---

### Separate Explain Engine

Rejected.

The Explain API should be built on top of the Debug Engine.

Maintaining two independent execution models would introduce duplicated logic and increase maintenance costs.

---

### Mutable Debug Session

Rejected.

Mutability would make debugging unreliable and difficult to reason about.

A DebugSession represents historical facts.

Historical execution data should never change once execution has completed.

---

## Future Evolution

The Debug Engine is designed as the foundation for future developer tooling.

Planned consumers include:

- Explain API
- Benchmark Suite
- VS Code Extension
- Chrome Extension
- CLI
- GuardEcosystem Website Playground
- AI Platform

Future features should consume the existing DebugSession rather than introducing alternative execution models.

The Debug Engine should remain independent of presentation layers and AI implementations.

Its only responsibility is to capture accurate execution data.

---

## Summary

The Debug Engine is considered core infrastructure within TextGuard.

It provides a single source of truth for execution data while remaining independent from presentation, visualization and AI features.

This architecture allows future tools and integrations to evolve without requiring changes to the core execution pipeline.

Future architectural changes to the Debug Engine should be documented through new ADRs rather than modifying this document.
