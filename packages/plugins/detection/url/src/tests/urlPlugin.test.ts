import { describe, expect, it } from "vitest";

import { createFilter } from "@textguard/core";

import { urlPlugin } from "../index";

describe("url-plugin", () => {
  it("should detect urls", () => {
    const filter = createFilter();

    filter.use(urlPlugin());

    const result = filter.findBadWords(
      "Visit https://google.com for more information.",
    );

    expect(result).toHaveLength(1);
    expect(result[0].matchedText).toBe("https://google.com");
  });

  it("should ignore normal text", () => {
    const filter = createFilter();

    filter.use(urlPlugin());

    expect(filter.findBadWords("Hello world")).toHaveLength(0);
  });

  it("should detect multiple urls", () => {
    const filter = createFilter();

    filter.use(urlPlugin());

    const result = filter.findBadWords(
      "Visit https://google.com and https://github.com",
    );

    expect(result).toHaveLength(2);
    expect(result[0].matchedText).toBe("https://google.com");
    expect(result[1].matchedText).toBe("https://github.com");
  });

  it("should work with filter()", () => {
    const filter = createFilter();

    filter.use(urlPlugin());

    const result = filter.filter("Website: https://google.com");

    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].matchedText).toBe("https://google.com");
    expect(result.filteredText).not.toContain("https://google.com");
  });
});
