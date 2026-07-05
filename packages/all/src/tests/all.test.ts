import { describe, expect, it } from "vitest";

import { createFilter, strictPreset } from "../index";

describe("@textguard/all", () => {
  const filter = createFilter(strictPreset);

  it("should detect profanity from bundled dictionaries", () => {
    expect(filter.hasBadWord("احمق")).toBe(true);
    expect(filter.hasBadWord("idiot")).toBe(true);
  });

  it("should detect email addresses", () => {
    expect(filter.hasBadWord("hello@example.com")).toBe(true);
  });

  it("should detect urls", () => {
    expect(filter.hasBadWord("https://textguard.dev")).toBe(true);
  });

  it("should detect phone numbers", () => {
    expect(filter.hasBadWord("+989121234567")).toBe(true);
  });

  it("should detect ipv4 addresses", () => {
    expect(filter.hasBadWord("192.168.1.10")).toBe(true);
  });

  it("should detect uuid values", () => {
    expect(filter.hasBadWord("550e8400-e29b-41d4-a716-446655440000")).toBe(
      true,
    );
  });

  it("should detect credit card numbers", () => {
    expect(filter.hasBadWord("4111111111111111")).toBe(true);
  });

  it("should detect iban numbers", () => {
    expect(filter.hasBadWord("IR062960000000100324200001")).toBe(true);
  });

  it("should ignore clean text", () => {
    expect(filter.hasBadWord("Hello TextGuard")).toBe(false);
  });
});
