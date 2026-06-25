export function isWhitelisted(
  whitelist: readonly string[],
  matchedText: string,
  text: string,
  start: number,
  end: number,
): boolean {
  return whitelist.some(
    (w) =>
      w.toLowerCase() === matchedText.toLowerCase() ||
      w.toLowerCase() === text.substring(start, end).toLowerCase(),
  );
}

import type { Match } from "../domain/match";

export function isOverlapped(
  matches: readonly Match[],
  start: number,
  end: number,
): boolean {
  return matches.some(
    (m) =>
      (start >= m.start && start < m.end) || (end > m.start && end <= m.end),
  );
}
