# @textguard/cli

Command line interface for TextGuard.

## Usage

```bash
textguard scan "text to scan"
```

Use `--word=<word>` to add one or more custom words for the scan:

```bash
textguard scan "hello secret" --word=secret
```

Use `--json` for machine-readable output:

```bash
textguard scan "hello secret" --word=secret --json
```

Exit codes are `0` for a clean scan, `1` when matches are found, and `2` for invalid CLI usage.

The CLI remains an adapter over `@textguard/core`; detection logic stays in the core package and configured packs.
