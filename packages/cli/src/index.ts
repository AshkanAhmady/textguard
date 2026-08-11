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
  files?: string[];
}

interface DebugOptions extends InputOptions {
  format: DebugFormat;
}

interface ExplainOptions extends InputOptions {
  json: boolean;
}

const CLI_VERSION = "0.1.0";

function printUsage(): void {
  console.log("TextGuard CLI");
  console.log("");
  console.log("Usage:");
  console.log("  textguard scan <text|-> [--file=<path>|--files=<path1,path2>] [--word=<word>] [--json]");
  console.log("  textguard debug <text|-> [--file=<path>] [--word=<word>] [--format=console|json|markdown|html]");
  console.log("  textguard explain <text|-> [--file=<path>] [--word=<word>] [--json]");
  console.log("  textguard help");
  console.log("  textguard version");
  console.log("");
  console.log('Use "-" to read text from stdin, --file=<path> for one UTF-8 file, or --files=<path1,path2> to batch scan files.');
}

function parseInputArg(arg: string, textParts: string[], customWords: string[], file: { value?: string }): boolean {
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

function finishInputOptions(textParts: string[], customWords: string[], file: string | undefined): InputOptions | null {
  const text = textParts.join(" ").trim();
  if (file && text) return null;
  if (!file && !text) return null;
  return { text, file, customWords };
}

function parseScanArgs(args: string[]): ScanOptions | null {
  const textParts: string[] = [];
  const customWords: string[] = [];
  const file: { value?: string } = {};
  let files: string[] | undefined;
  let json = false;
  for (const arg of args) {
    if (arg === "--json") { json = true; continue; }
    if (arg.startsWith("--files=")) {
      if (files || file.value) return null;
      const paths = arg.slice("--files=".length).split(",").map((path) => path.trim()).filter(Boolean);
      if (paths.length === 0) return null;
      files = paths;
      continue;
    }
    if (!parseInputArg(arg, textParts, customWords, file)) return null;
  }
  if (files) {
    if (file.value || textParts.join(" ").trim()) return null;
    return { text: "", customWords, json, files };
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
  if (!parsed || parsed.files) return null;
  return parsed;
}

function readStdin(): Promise<string> {
  return new Promise((resolve, reject) => {
    let input = "";
    process.stdin.setEncoding("utf8");
    process.stdin.on("data", (chunk) => { input += chunk; });
    process.stdin.on("end", () => resolve(input.trim()));
    process.stdin.on("error", reject);
  });
}

async function resolveText(options: InputOptions): Promise<string | null> {
  if (options.file) {
    try { return (await readFile(options.file, "utf8")).trim() || null; } catch { return null; }
  }
  if (options.text !== "-") return options.text;
  const stdin = await readStdin();
  return stdin || null;
}

async function readBatchFiles(paths: string[]): Promise<Array<{ path: string; text: string }> | null> {
  try {
    const files = await Promise.all(paths.map(async (path) => ({ path, text: (await readFile(path, "utf8")).trim() })));
    return files.every((file) => file.text.length > 0) ? files : null;
  } catch { return null; }
}

function renderDebug(format: DebugFormat, text: string, customWords: string[]): string {
  const report = createFilter({ customWords }).debug(text).report();
  switch (format) {
    case "json": return new JsonRenderer().render(report);
    case "markdown": return new MarkdownRenderer().render(report);
    case "html": return new HtmlRenderer().render(report);
    case "console": return new ConsoleRenderer().render(report);
  }
}

async function main(): Promise<void> {
  const [, , command, ...args] = process.argv;

  if (!command || command === "help" || command === "--help" || command === "-h") {
    printUsage();
    process.exitCode = 0;
    return;
  }

  if (command === "version" || command === "--version" || command === "-v") {
    console.log(CLI_VERSION);
    process.exitCode = 0;
    return;
  }

  if (command === "scan") {
    const options = parseScanArgs(args);
    if (!options) { printUsage(); process.exitCode = 2; return; }
    const filter = createFilter({ customWords: options.customWords });
    if (options.files) {
      const files = await readBatchFiles(options.files);
      if (!files) { printUsage(); process.exitCode = 2; return; }
      const results = files.map(({ path, text }) => ({ path, result: filter.filter(text) }));
      const matchCount = results.reduce((total, item) => total + item.result.matches.length, 0);
      const matchedFiles = results.filter((item) => item.result.matches.length > 0).length;
      if (options.json) console.log(JSON.stringify({ files: results, summary: { fileCount: results.length, matchedFiles, matchCount } }, null, 2));
      else {
        console.log("TextGuard Batch Scan");
        for (const item of results) console.log(`${item.path}: ${item.result.matches.length} match(es)`);
        console.log(`Files: ${results.length}`);
        console.log(`Matched files: ${matchedFiles}`);
        console.log(`Matches: ${matchCount}`);
      }
      process.exitCode = matchCount > 0 ? 1 : 0;
      return;
    }
    const text = await resolveText(options);
    if (!text) { printUsage(); process.exitCode = 2; return; }
    const result = filter.filter(text);
    if (options.json) console.log(JSON.stringify(result, null, 2));
    else {
      console.log("TextGuard Scan");
      console.log(`Matches: ${result.matches.length}`);
      for (const match of result.matches) console.log(`- ${match.matchedText} [${match.start}-${match.end}]`);
      console.log(`Filtered: ${result.filteredText}`);
    }
    process.exitCode = result.matches.length > 0 ? 1 : 0;
    return;
  }

  if (command === "debug") {
    const options = parseDebugArgs(args);
    if (!options) { printUsage(); process.exitCode = 2; return; }
    const text = await resolveText(options);
    if (!text) { printUsage(); process.exitCode = 2; return; }
    console.log(renderDebug(options.format, text, options.customWords));
    process.exitCode = 0;
    return;
  }

  if (command === "explain") {
    const options = parseExplainArgs(args);
    if (!options) { printUsage(); process.exitCode = 2; return; }
    const text = await resolveText(options);
    if (!text) { printUsage(); process.exitCode = 2; return; }
    const result = createFilter({ customWords: options.customWords }).explain(text);
    if (options.json) console.log(JSON.stringify(result, null, 2));
    else {
      console.log("TextGuard Explain");
      console.log(`Matched: ${result.matched ? "yes" : "no"}`);
      console.log(`Matches: ${result.summary.matchCount}`);
      for (const explained of result.matches) {
        console.log(`- ${explained.match.matchedText} [${explained.match.start}-${explained.match.end}]`);
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
