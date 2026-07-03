describe("TextGuard Regex Engine - Obfuscation Detection", () => {
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
});
