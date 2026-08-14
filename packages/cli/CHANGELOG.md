# @textguard/cli

## 0.2.1

### Patch Changes

- 44d7280: Report the installed package version from CLI metadata instead of a stale hard-coded value.

## 0.2.0

### Minor Changes

- 116c952: Add deterministic multi-file batch scanning with aggregate JSON and console summaries.
- be8a7a7: Add a `textguard debug` command with console, JSON, Markdown, and HTML renderer output.
- af64e90: Add a Core-backed `textguard explain` command with readable and JSON output.
- 94643a5: Add direct UTF-8 file input to scan, debug, and explain commands.
- bbcda86: Add standard help and version commands and make no-argument invocation print help successfully.
- fd1e7c8: Add the initial TextGuard CLI package with a scan command entrypoint.
- 1e37e55: Allow scan, debug, and explain commands to read text from stdin using `-`.

### Patch Changes

- fea501b: Connect the scan command to @textguard/core with stable output, JSON mode, custom-word scanning, and CI-friendly exit codes.
- 9a2fc09: Prepare the CLI package for public npm publishing.
- Updated dependencies [3f6b7ba]
- Updated dependencies [c3052be]
- Updated dependencies [d6dd4cd]
- Updated dependencies [4b50ec3]
  - @textguard/core@1.1.0
