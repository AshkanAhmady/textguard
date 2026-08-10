import { describe, expect, it } from "vitest";

import { createFilter } from "@textguard/core";

import { ibanPlugin } from "../index";

describe("iban-plugin", () => {
  it("should detect ibans", () => {
    const filter = createFilter();

    filter.use(ibanPlugin());

    const result = filter.findBadWords("IBAN: IR820540102680020817909002");

    expect(result).toHaveLength(1);
    expect(result[0].matchedText).toBe("IR820540102680020817909002");
  });

  it("should detect multiple ibans", () => {
    const filter = createFilter();

    filter.use(ibanPlugin());

    const result = filter.findBadWords(
      "IBANs: IR820540102680020817909002 and DE89370400440532013000",
    );

    expect(result).toHaveLength(2);
  });

  it("should ignore normal text", () => {
    const filter = createFilter();

    filter.use(ibanPlugin());

    expect(filter.findBadWords("Hello TextGuard")).toHaveLength(0);
  });

  it("should work with filter()", () => {
    const filter = createFilter();

    filter.use(ibanPlugin());

    const result = filter.filter("IBAN: IR820540102680020817909002");

    expect(result.matches).toHaveLength(1);
    expect(result.filteredText).not.toContain("IR820540102680020817909002");
  });

  it("should ignore invalid ibans", () => {
    const filter = createFilter();

    filter.use(ibanPlugin());

    expect(filter.findBadWords("IR123")).toHaveLength(0);
  });
});
