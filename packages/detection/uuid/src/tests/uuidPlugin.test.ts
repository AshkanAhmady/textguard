import { describe, expect, it } from "vitest";

import { createFilter } from "@textguard/core";

import { uuidPlugin } from "../index";

describe("uuid-plugin", () => {
  it("should detect uuid", () => {
    const filter = createFilter();

    filter.use(uuidPlugin());

    const result = filter.findBadWords(
      "UUID: 550e8400-e29b-41d4-a716-446655440000",
    );

    expect(result).toHaveLength(1);
    expect(result[0].matchedText).toBe("550e8400-e29b-41d4-a716-446655440000");
  });

  it("should detect multiple uuids", () => {
    const filter = createFilter();

    filter.use(uuidPlugin());

    const result = filter.findBadWords(
      "IDs: 550e8400-e29b-41d4-a716-446655440000 and 123e4567-e89b-12d3-a456-426614174000",
    );

    expect(result).toHaveLength(2);
    expect(result[0].matchedText).toBe("550e8400-e29b-41d4-a716-446655440000");
    expect(result[1].matchedText).toBe("123e4567-e89b-12d3-a456-426614174000");
  });

  it("should ignore normal text", () => {
    const filter = createFilter();

    filter.use(uuidPlugin());

    expect(filter.findBadWords("Hello TextGuard")).toHaveLength(0);
  });

  it("should work with filter()", () => {
    const filter = createFilter();

    filter.use(uuidPlugin());

    const result = filter.filter("UUID: 550e8400-e29b-41d4-a716-446655440000");

    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].matchedText).toBe(
      "550e8400-e29b-41d4-a716-446655440000",
    );

    expect(result.filteredText).not.toContain(
      "550e8400-e29b-41d4-a716-446655440000",
    );
  });

  it("should ignore invalid uuid", () => {
    const filter = createFilter();

    filter.use(uuidPlugin());

    expect(
      filter.findBadWords("550e8400-e29b-99d4-a716-446655440000"),
    ).toHaveLength(0);

    expect(
      filter.findBadWords("12345678-1234-1234-1234-123456789"),
    ).toHaveLength(0);
  });
});
