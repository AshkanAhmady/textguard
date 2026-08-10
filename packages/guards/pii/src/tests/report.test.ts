import { describe, expect, it } from "vitest";
import { scanText } from "../scan";
import {
  toFileResult,
  formatConsoleReport,
  formatMarkdownReport,
} from "../report";

const dirtyContent = "Contact: hello@example.com";
const cleanContent = "Nothing to see here.";

describe("toFileResult", () => {
  it("attaches a 1-based line number to each finding", () => {
    const content = "line one\nline two hello@example.com\nline three";
    const result = scanText(content);
    const fileResult = toFileResult("notes.txt", content, result);

    expect(fileResult.findings).toHaveLength(1);
    expect(fileResult.findings[0].line).toBe(2);
  });
});

describe("formatConsoleReport", () => {
  it("reports clean when nothing was found", () => {
    const result = scanText(cleanContent);
    const report = formatConsoleReport([
      toFileResult("clean.txt", cleanContent, result),
    ]);

    expect(report).toBe("✔ No PII found.");
  });

  it("lists file, line, type and match for each finding", () => {
    const result = scanText(dirtyContent);
    const report = formatConsoleReport([
      toFileResult("dirty.txt", dirtyContent, result),
    ]);

    expect(report).toContain("dirty.txt");
    expect(report).toContain("[email]");
    expect(report).toContain("hello@example.com");
  });
});

describe("formatMarkdownReport", () => {
  it("reports clean when nothing was found", () => {
    const result = scanText(cleanContent);
    const report = formatMarkdownReport([
      toFileResult("clean.txt", cleanContent, result),
    ]);

    expect(report).toContain("No PII found");
  });

  it("renders a markdown table row per finding", () => {
    const result = scanText(dirtyContent);
    const report = formatMarkdownReport([
      toFileResult("dirty.txt", dirtyContent, result),
    ]);

    expect(report).toContain("| dirty.txt | 1 | email | `hello@example.com` |");
  });
});
