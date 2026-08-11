#!/usr/bin/env node

const [, , command, ...args] = process.argv;

if (command !== "scan") {
  console.log("Usage: textguard scan <text>");
  process.exitCode = 1;
} else {
  const input = args.join(" ");

  if (!input) {
    console.error("Text is required");
    process.exitCode = 1;
  } else {
    // CLI adapter placeholder. Detection stays in @textguard/core.
    console.log(`TextGuard scan: ${input}`);
  }
}
