import { describe, it, expect } from "vitest";
import { createFilter } from "@textguard/core";
import { emailPlugin } from "../index";

describe("email-plugin", () => {
  it("should detect email addresses", () => {
    const filter = createFilter();

    filter.use(emailPlugin());

    const result = filter.findBadWords("Contact me at hello@example.com");

    expect(result).toHaveLength(1);

    expect(result[0].matchedText).toBe("hello@example.com");
  });

  it("should ignore normal text", () => {
    const filter = createFilter();

    filter.use(emailPlugin());

    expect(filter.findBadWords("Hello world")).toHaveLength(0);
  });

  it("should detect email using plugin", () => {
    const guard = createFilter();

    guard.use(emailPlugin());

    const result = guard.filter("Contact me at test@example.com");

    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].matchedText).toBe("test@example.com");
    expect(result.filteredText).toContain("***");
  });
});
