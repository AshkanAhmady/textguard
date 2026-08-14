import { createRegexRule } from "@textguard/core";
import { EMAIL_REGEX } from "../regex/emailRegex";

export const EmailRule = createRegexRule({
  id: "email",
  name: "Email Rule",
  category: "email",
  severity: "low",
  priority: 50,
  regex: EMAIL_REGEX,
  word: "email",
});
