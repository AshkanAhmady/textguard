# @textguard/cli

Command line interface for TextGuard.

## Input

Commands accept inline text, stdin via `-`, or a UTF-8 file via `--file=<path>`. File input is mutually exclusive with inline text/stdin.

```bash
textguard scan "text to scan"
cat message.txt | textguard scan -
textguard scan --file=message.txt
```

## Scan

Use `--word=<word>` to add one or more custom words and `--json` for machine-readable output:

```bash
textguard scan --file=message.txt --word=secret --json
```

Batch scan multiple UTF-8 files with `--files=<path1,path2>`:

```bash
textguard scan --files=one.txt,two.txt --word=secret
textguard scan --files=one.txt,two.txt --word=secret --json
```

Batch JSON output contains per-file results plus a summary with `fileCount`, `matchedFiles`, and `matchCount`. Scan exit codes are `0` when all input is clean, `1` when at least one match is found, and `2` for invalid or unreadable input.

## Debug

Use the Core debug engine directly from the CLI:

```bash
textguard debug "hello secret" --word=secret
textguard debug --file=message.txt --format=json
```

Valid debug formats are `console`, `json`, `markdown`, and `html`. Successful debug commands exit with `0`; invalid input or usage exits with `2`.

## Explain

Use the Core Explain API to see why text matched and which source produced each match:

```bash
textguard explain "hello secret" --word=secret
textguard explain --file=message.txt --json
```

Explain exit codes are `0` for clean text, `1` when matches are explained, and `2` for invalid input or CLI usage.

The CLI remains an adapter over `@textguard/core`; detection, debug, and explain behavior stay in Core and configured packs.
