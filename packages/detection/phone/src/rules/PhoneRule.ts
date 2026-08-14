import { createRegexRule } from "@textguard/core";
import { PHONE_REGEX } from "../regex/phoneRegex";

export const PhoneRule = createRegexRule({
  id: "phone",
  name: "Phone Rule",
  category: "phone",
  severity: "medium",
  priority: 50,
  regex: PHONE_REGEX,
  word: "phone",
});
