import { describe, expect, it } from "vitest";

import { createFilter } from "@textguard/core";

import { ipPlugin } from "../index";

describe("ip-plugin", () => {
  it("should detect ipv4 addresses", () => {
    const filter = createFilter();

    filter.use(ipPlugin());

    const result = filter.findBadWords("Server IP: 192.168.1.100");

    expect(result).toHaveLength(1);
    expect(result[0].matchedText).toBe("192.168.1.100");
  });

  it("should detect multiple ipv4 addresses", () => {
    const filter = createFilter();

    filter.use(ipPlugin());

    const result = filter.findBadWords("IPs: 192.168.1.100 and 10.0.0.1");

    expect(result).toHaveLength(2);
    expect(result[0].matchedText).toBe("192.168.1.100");
    expect(result[1].matchedText).toBe("10.0.0.1");
  });

  it("should ignore normal text", () => {
    const filter = createFilter();

    filter.use(ipPlugin());

    expect(filter.findBadWords("Hello TextGuard")).toHaveLength(0);
  });

  it("should work with filter()", () => {
    const filter = createFilter();

    filter.use(ipPlugin());

    const result = filter.filter("Server IP: 192.168.1.100");

    expect(result.matches).toHaveLength(1);
    expect(result.matches[0].matchedText).toBe("192.168.1.100");
    expect(result.filteredText).not.toContain("192.168.1.100");
  });

  it("should ignore invalid ipv4 addresses", () => {
    const filter = createFilter();

    filter.use(ipPlugin());

    expect(filter.findBadWords("999.999.999.999")).toHaveLength(0);

    expect(filter.findBadWords("256.1.1.1")).toHaveLength(0);
  });
});
