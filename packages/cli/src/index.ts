#!/usr/bin/env node

import {
  ConsoleRenderer,
  HtmlRenderer,
  JsonRenderer,
  MarkdownRenderer,
  createFilter,
} from "@textguard/core";

type DebugFormat = "console" | "json" | "markdown" | "html";

interface ScanOptions {
  text: string;
  customWords: string[];
  json: boolean;
}

interface DebugOptions {
  text: string;
  customWords: string[];
  format: DebugFormat;
}

interface ExplainOptions {
  text: string;
  customWords: string[];
  json: boolean;
}

function printUsage(): void {
  console.log("Usage:");
  console.log("  textguard scan <text> [--word=<word>] [--json]");
  console.log(
    "  textguard debug <text> [--word=<word>] [--format=console|json|markdown|html]",
  );
  console.log("  textguard explain <text> [--word=<word>] [--json]");
}

function parseScanArgs(args: string[]): ScanOptions | null {
  const textParts: string[] = [];
  const customWords: string[] = [];
  let json = false;

  for (const arg of args) {
    if (arg === "--json") {
      json = true;
      continue;
    }

    if (arg.startsWith("--word=")) {
      const word = arg.slice("--word=".length).trim();
      if (!word) return null;
      customWords.push(word);
      continue;
    }

    if (arg.startsWith("--")) return null;
    textParts.push(arg);
  }

  const text = textParts.join(" ").trim();
  if (!text) return null;

  return { text, customWords, json };
}

function isDebugFormat(value: string): value is DebugFormat {
  return ["console", "json", "markdown", "html"].includes(value);
}

function parseDebugArgs(args: string[]): DebugOptions | null {
  const textParts: string[] = [];
  const customWords: string[] = [];
  let format: DebugFormat = "console";

  for (const arg of args) {
    if (arg.startsWith("--word=")) {
      const word = arg.slice("--word=".length).trim();
      if (!word) return null;
      customWords.push(word);
      continue;
    }

    if (arg.startsWith("--format=")) {
      const value = arg.slice("--format=".length).trim();
      if (!isDebugFormat(value)) return null;
      format = value;
      continue;
    }

    if (arg.startsWith("--")) return null;
    textParts.push(arg);
  }

  const text = textParts.join(" ").trim();
  if (!text) return null;

  return { text, customWords, format };
}

function parseExplainArgs(args: string[]): ExplainOptions | null {
  const parsed = parseScanArgs(args);
  if (!parsed) return null;

  return parsed;
}

function renderDebug(
  format: DebugFormat,
  text: string,
  customWords: string[],
): string {
  const report = createFilter({ customWords }).debug(text).report();

  switch (format) {
    case "json":
      return new JsonRenderer().render(report);
    case "markdown":
      return new MarkdownRenderer().render(report);
    case "html":
      return new HtmlRenderer().render(report);
    case "console":
      return new ConsoleRenderer().render(report);
  }
}

const [, , command, ...args] = process.argv;

if (command === "scan") {
  const options = parseScanArgs(args);

  if (!options) {
    printUsage();
    process.exitCode = 2;
  } else {
    const filter = createFilter({ customWords: options.customWords });
    const result = filter.filter(options.text);

    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log("TextGuard Scan");
      console.log(`Matches: ${result.matches.length}`);

      for (const match of result.matches) {
        console.log(`- ${match.matchedText} [${match.start}-${match.end}]`);
      }

      console.log(`Filtered: ${result.filteredText}`);
    }

    process.exitCode = result.matches.length > 0 ? 1 : 0;
  }
} else if (command === "debug") {
  const options = parseDebugArgs(args);

  if (!options) {
    printUsage();
    process.exitCode = 2;
  } else {
    console.log(renderDebug(options.format, options.text, options.customWords));
    process.exitCode = 0;
  }
} else if (command === "explain") {
  const options = parseExplainArgs(args);

  if (!options) {
    printUsage();
    process.exitCode = 2;
  } else {
    const result = createFilter({ customWords: options.customWords }).explain(
      options.text,
    );

    if (options.json) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log("TextGuard Explain");
      console.log(`Matched: ${result.matched ? "yes" : "no"}`);
      console.log(`Matches: ${result.summary.matchCount}`);

      for (const explained of result.matches) {
        console.log(
          `- ${explained.match.matchedText} [${explained.match.start}-${explained.match.end}]`,
        );
        console.log(`  Source: ${explained.source.plugin}`);
        console.log(`  Reason: ${explained.reason.message}`);
      }
    }

    process.exitCode = result.matched ? 1 : 0;
  }
} else {
  printUsage();
  process.exitCode = 2;
}
