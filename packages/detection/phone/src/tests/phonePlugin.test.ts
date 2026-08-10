import { describe, expect, it } from "vitest";

import { createFilter } from "@textguard/core";

import { phonePlugin } from "../index";

describe("phone-plugin", () => {
  it("should detect phone numbers", () => {
    const filter = createFilter();

    filter.use(phonePlugin());

    const result = filter.findBadWords("Call me at +989121234567");

    expect(result).toHaveLength(1);
    expect(result[0].matchedText).toBe("+989121234567");
  });

  it("should detect multiple phone numbers", () => {
    const filter = createFilter();

    filter.use(phonePlugin());

    const result = filter.findBadWords(
      "Numbers: +989121234567 and +989351112233",
    );

    expect(result).toHaveLength(2);
    expect(result[0].matchedText).toBe("+989121234567");
    expect(result[1].matchedText).toBe("+989351112233");
  });

  it("should ignore normal text", () => {
    const filter = createFilter();

    filter.use(phonePlugin());

    expect(filter.findBadWords("Hello world")).toHaveLength(0);
  });

  it("should work with filter()", () => {
    const filter = createFilter();

    filter.use(phonePlugin());

    const result = filter.filter("Call me at +989121234567");

    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].matchedText).toBe("+989121234567");
    expect(result.filteredText).not.toContain("+989121234567");
  });
});
