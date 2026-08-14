import { createRegexRule } from "@textguard/core";
import { IP_REGEX } from "../regex/ipRegex";

export const IpRule = createRegexRule({
  id: "ip",
  name: "IP Rule",
  category: "ip",
  severity: "medium",
  priority: 50,
  regex: IP_REGEX,
  word: "ip",
});
