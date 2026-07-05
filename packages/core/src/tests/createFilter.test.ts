import { describe, it, expect } from "vitest";
import { createFilter } from "../createFilter";
import type { Plugin } from "../domain/plugin";

describe("TextGuard Engine - Plugin Registration", () => {
  it("should register plugins passed to createFilter", () => {
    let setupCalled = false;

    const plugin: Plugin = {
      name: "test-plugin",

      setup() {
        setupCalled = true;
      },
    };

    createFilter({
      plugins: [plugin],
    });

    expect(setupCalled).toBe(true);
  });
});
