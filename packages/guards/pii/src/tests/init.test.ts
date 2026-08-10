import { describe, expect, it } from "vitest";
import { addPreCommitCommand, PRE_COMMIT_COMMAND } from "../init";

describe("PII init setup", () => {
  it("adds the TextGuard command to an empty pre-commit file", () => {
    expect(addPreCommitCommand("")).toBe(`${PRE_COMMIT_COMMAND}\n`);
  });

  it("replaces Husky's default npm test placeholder", () => {
    expect(addPreCommitCommand("npm test\n")).toBe(`${PRE_COMMIT_COMMAND}\n`);
  });

  it("appends the command without removing existing hook commands", () => {
    expect(addPreCommitCommand("pnpm lint\n")).toBe(
      `pnpm lint\n${PRE_COMMIT_COMMAND}\n`,
    );
  });

  it("is idempotent when the hook is already configured", () => {
    const existing = `pnpm lint\n${PRE_COMMIT_COMMAND}\n`;
    expect(addPreCommitCommand(existing)).toBe(existing);
  });
});
