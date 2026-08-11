#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import {
  ConsoleRenderer,
  HtmlRenderer,
  JsonRenderer,
  MarkdownRenderer,
  createFilter,
} from "@textguard/core";

type DebugFormat = "console" | "json" | "markdown" | "html";

interface InputOptions {
  text: string;
  file?: string;
  customWords: string[];
}

interface ScanOptions extends InputOptions {
  json: boolean;
}

interface DebugOptions extends InputOptions {
  format: DebugFormat;
}

interface ExplainOptions extends InputOptions {
  json: boolean;
}

function printUsage(): void {
  console.log("Usage:");
  console.log("  textguard scan <text|-> [--file=<path>] [--word=<word>] [--json]");
  console.log(
    "  textguard debug <text|-> [--file=<path>] [--word=<word>] [--format=console|json|markdown|html]",
  );
  console.log("  textguard explain <text|-> [--file=<path>] [--word=<word>] [--json]");
  console.log("");
  console.log('Use "-" to read text from stdin, or --file=<path> to read a UTF-8 file.');
}

function parseInputArg(
  arg: string,
  textParts: string[],
  customWords: string[],
  file: { value?: string },
): boolean {
  if (arg.startsWith("--word=")) {
    const word = arg.slice("--word=".length).trim();
    if (!word) return false;
    customWords.push(word);
    return true;
  }

  if (arg.startsWith("--file=")) {
    const path = arg.slice("--file=".length).trim();
    if (!path || file.value) return false;
    file.value = path;
    return true;
  }

  if (arg.startsWith("--")) return false;
  textParts.push(arg);
  return true;
}

function finishInputOptions(
  textParts: string[],
  customWords: string[],
  file: string | undefined,
): InputOptions | null {
  const text = textParts.join(" ").trim();
  if (file && text) return null;
  if (!file && !text) return null;
  return { text, file, customWords };
}

function parseScanArgs(args: string[]): ScanOptions | null {
  const textParts: string[] = [];
  const customWords: string[] = [];
  const file: { value?: string } = {};
  let json = false;

  for (const arg of args) {
    if (arg === "--json") {
      json = true;
      continue;
    }
    if (!parseInputArg(arg, textParts, customWords, file)) return null;
  }

  const input = finishInputOptions(textParts, customWords, file.value);
  return input ? { ...input, json } : null;
}

function isDebugFormat(value: string): value is DebugFormat {
  return ["console", "json", "markdown", "html"].includes(value);
}

function parseDebugArgs(args: string[]): DebugOptions | null {
  const textParts: string[] = [];
  const customWords: string[] = [];
  const file: { value?: string } = {};
  let format: DebugFormat = "console";

  for (const arg of args) {
    if (arg.startsWith("--format=")) {
      const value = arg.slice("--format=".length).trim();
      if (!isDebugFormat(value)) return null;
      format = value;
      continue;
    }
    if (!parseInputArg(arg, textParts, customWords, file)) return null;
  }

  const input = finishInputOptions(textParts, customWords, file.value);
  return input ? { ...input, format } : null;
}

function parseExplainArgs(args: string[]): ExplainOptions | null {
  const parsed = parseScanArgs(args);
  return parsed;
}

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let input = "";

    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => {
      input += chunk;
    });
    process.stdin.on("end", () => resolve(input.trim()));
    process.stdin.on("error", reject);
  });
}

async function resolveText(options: InputOptions): Promise<string | null> {
  if (options.file) {
    try {
      const content = await readFile(options.file, "utf8");
      return content.trim() || null;
    } catch {
      return null;
    }
  }

  if (options.text !== "-") return options.text;

  const stdin = await readStdin();
  return stdin || null;
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

async function main(): Promise<void> {
  const [, , command, ...args] = process.argv;

  if (command === "scan") {
    const options = parseScanArgs(args);
    if (!options) {
      printUsage();
      process.exitCode = 2;
      return;
    }

    const text = await resolveText(options);
    if (!text) {
      printUsage();
      process.exitCode = 2;
      return;
    }

    const result = createFilter({ customWords: options.customWords }).filter(text);
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
    return;
  }

  if (command === "debug") {
    const options = parseDebugArgs(args);
    if (!options) {
      printUsage();
      process.exitCode = 2;
      return;
    }

    const text = await resolveText(options);
    if (!text) {
      printUsage();
      process.exitCode = 2;
      return;
    }

    console.log(renderDebug(options.format, text, options.customWords));
    process.exitCode = 0;
    return;
  }

  if (command === "explain") {
    const options = parseExplainArgs(args);
    if (!options) {
      printUsage();
      process.exitCode = 2;
      return;
    }

    const text = await resolveText(options);
    if (!text) {
      printUsage();
      process.exitCode = 2;
      return;
    }

    const result = createFilter({ customWords: options.customWords }).explain(text);
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
    return;
  }

  printUsage();
  process.exitCode = 2;
}

void main();
