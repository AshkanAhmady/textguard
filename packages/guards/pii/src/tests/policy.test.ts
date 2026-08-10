import { describe, expect, it } from "vitest";
import { applyPolicy, isPathIgnored, pathMatches } from "../policy";
import type { ScanResult } from "../scan";

const finding = {
  type: "email" as const,
  matchedText: "fixture-email",
  start: 0,
  end: 13,
};

const detected: ScanResult = {
  clean: false,
  findings: [finding],
};

describe("PII policy", () => {
  it("allowlists exact values by detector type", () => {
    expect(
      applyPolicy("src/example.ts", detected, {
        allowlist: { email: ["fixture-email"] },
      }),
    ).toEqual({ clean: true, findings: [] });
  });

  it("does not apply an allowlist value to another detector type", () => {
    expect(
      applyPolicy("src/example.ts", detected, {
        allowlist: { phone: ["fixture-email"] },
      }),
    ).toEqual(detected);
  });

  it("ignores configured path globs", () => {
    expect(
      isPathIgnored("tests/fixtures/contact.ts", {
        ignorePaths: ["tests/fixtures/**"],
      }),
    ).toBe(true);
  });

  it("supports narrowly scoped suppressions", () => {
    expect(
      applyPolicy("docs/example.md", detected, {
        suppressions: [
          {
            path: "docs/**",
            type: "email",
            matchedText: "fixture-email",
          },
        ],
      }),
    ).toEqual({ clean: true, findings: [] });
  });

  it("supports single and recursive wildcard path matching", () => {
    expect(pathMatches("src/*.ts", "src/index.ts")).toBe(true);
    expect(pathMatches("src/*.ts", "src/nested/index.ts")).toBe(false);
    expect(pathMatches("src/**", "src/nested/index.ts")).toBe(true);
  });
});
