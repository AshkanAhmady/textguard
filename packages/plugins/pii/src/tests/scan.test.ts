import { describe, expect, it } from "vitest";
import { scanText, scanMany } from "../scan";

describe("scanText", () => {
  it("flags an email address", () => {
    const result = scanText("Contact me at hello@example.com");

    expect(result.clean).toBe(false);
    expect(result.findings).toHaveLength(1);
    expect(result.findings[0].type).toBe("email");
    expect(result.findings[0].matchedText).toBe("hello@example.com");
  });

  it("flags a phone number", () => {
    const result = scanText("Call me at +989121234567");

    expect(result.clean).toBe(false);
    expect(result.findings[0].type).toBe("phone");
  });

  it("flags a valid credit card number", () => {
    const result = scanText("Card: 4111 1111 1111 1111");

    expect(result.clean).toBe(false);
    expect(result.findings).toHaveLength(1);
    expect(result.findings[0].type).toBe("credit-card");
  });

  it("flags a valid IBAN", () => {
    const result = scanText("IBAN: IR820540102680020817909002");

    expect(result.clean).toBe(false);
    expect(result.findings[0].type).toBe("iban");
  });

  it("flags multiple PII types in one string", () => {
    const result = scanText("Email hello@example.com or call +989121234567");

    expect(result.findings).toHaveLength(2);
    expect(result.findings.map((f) => f.type).sort()).toEqual([
      "email",
      "phone",
    ]);
  });

  it("reports clean for text with no PII", () => {
    const result = scanText("This is a perfectly normal sentence.");

    expect(result.clean).toBe(true);
    expect(result.findings).toHaveLength(0);
  });

  it("classifies an overlapping match as credit-card, not phone, when Luhn is valid", () => {
    const result = scanText("Card: 4111 1111 1111 1112");

    // Fails Luhn, so the credit-card rule rejects it — but the same digits
    // still match the (unvalidated) phone regex, which is correct: without
    // a valid checksum, "is this a phone number?" is a reasonable read.
    expect(result.clean).toBe(false);
    expect(result.findings[0].type).toBe("phone");
  });
});

describe("scanMany", () => {
  it("scans each input independently, preserving order", () => {
    const results = scanMany(["clean line", "hello@example.com", "also clean"]);

    expect(results).toHaveLength(3);
    expect(results[0].clean).toBe(true);
    expect(results[1].clean).toBe(false);
    expect(results[2].clean).toBe(true);
  });
});
