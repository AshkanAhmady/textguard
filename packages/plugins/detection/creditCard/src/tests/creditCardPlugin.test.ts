import { describe, expect, it } from "vitest";

import { createFilter } from "@textguard/core";

import { creditCardPlugin } from "../index";

describe("credit-card-plugin", () => {
  it("should detect credit card numbers", () => {
    const filter = createFilter();

    filter.use(creditCardPlugin());

    const result = filter.findBadWords("Card: 4111 1111 1111 1111");

    expect(result).toHaveLength(1);
    expect(result[0].matchedText).toBe("4111 1111 1111 1111");
  });

  it("should detect multiple credit card numbers", () => {
    const filter = createFilter();

    filter.use(creditCardPlugin());

    const result = filter.findBadWords(
      "Cards: 4111 1111 1111 1111 and 5555 5555 5555 4444",
    );

    expect(result).toHaveLength(2);
    expect(result[0].matchedText).toBe("4111 1111 1111 1111");
    expect(result[1].matchedText).toBe("5555 5555 5555 4444");
  });

  it("should ignore normal text", () => {
    const filter = createFilter();

    filter.use(creditCardPlugin());

    expect(filter.findBadWords("Hello TextGuard")).toHaveLength(0);
  });

  it("should work with filter()", () => {
    const filter = createFilter();

    filter.use(creditCardPlugin());

    const result = filter.filter("Card: 4111 1111 1111 1111");

    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].matchedText).toBe("4111 1111 1111 1111");

    expect(result.filteredText).not.toContain("4111 1111 1111 1111");
  });

  it("should ignore invalid credit card numbers", () => {
    const filter = createFilter();

    filter.use(creditCardPlugin());

    expect(filter.findBadWords("1234 5678 9012")).toHaveLength(0);
  });
});
