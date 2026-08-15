import { escapeRegExp } from "../utils/escapeRegExp";

export interface BuildWordRegexOptions {
  leetspeakMapping: Record<string, string[]>;
  faLookalikesMapping: Record<string, string>;
}

export function buildWordRegex(
  word: string,
  options: BuildWordRegexOptions,
): RegExp {
  const separator = "[\\s\\p{P}\\p{S}\\u200c\\u200d\\u0640]*";
  const wordContinuation = "[\\p{L}\\p{N}\\p{M}\\u200c\\u200d]";

  const parts = Array.from(word).map((char) => {
    const lowerChar = char.toLowerCase();

    if (options.faLookalikesMapping[lowerChar]) {
      return `${options.faLookalikesMapping[lowerChar]}+`;
    }

    if (options.leetspeakMapping[lowerChar]) {
      const alternatives = [
        escapeRegExp(lowerChar),
        ...options.leetspeakMapping[lowerChar].map(escapeRegExp),
      ];

      return `(${alternatives.join("|")})+`;
    }

    return `${escapeRegExp(char)}+`;
  });

  const body = parts.join(separator);

  return new RegExp(
    `(?<!${wordContinuation})${body}(?!${wordContinuation})`,
    "giu",
  );
}
