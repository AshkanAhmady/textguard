import { escapeRegExp } from "../utils/escapeRegExp";

export interface BuildWordRegexOptions {
  leetspeakMapping: Record<string, string[]>;
  faLookalikesMapping: Record<string, string>;
}

const latinLetter = /\p{Script=Latin}/u;
const MAX_INTERNAL_SEPARATOR_LENGTH = 2;

export function buildWordRegex(
  word: string,
  options: BuildWordRegexOptions,
): RegExp {
  const separator = `[\\s\\p{P}\\p{S}\\u200c\\u200d\\u0640]{0,${MAX_INTERNAL_SEPARATOR_LENGTH}}`;

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
  const usesLatinBoundary = Array.from(word).some((char) =>
    latinLetter.test(char),
  );

  if (!usesLatinBoundary) {
    return new RegExp(body, "giu");
  }

  const latinContinuation = "[\\p{Script=Latin}\\p{N}\\p{M}\\u200c\\u200d]";

  return new RegExp(
    `(?<!${latinContinuation})${body}(?!${latinContinuation})`,
    "giu",
  );
}
