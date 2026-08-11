#!/usr/bin/env node

import { createFilter } from "@textguard/core";

interface ScanOptions {
  text: string;
  customWords: string[];
  json: boolean;
}

function printUsage(): void {
  console.log("Usage: textguard scan <text> [--word=<word>] [--json]");
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

const [, , command, ...args] = process.argv;

if (command !== "scan") {
  printUsage();
  process.exitCode = 2;
} else {
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
}
