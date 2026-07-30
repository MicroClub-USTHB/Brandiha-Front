/**
 * Where a challenge sits relative to its submission window, shared by the
 * server (`getPublicChallenges`, `ChallengeGrid`) and the client card.
 *
 * One implementation on purpose: a card, the grid it sits in, and the detail
 * page it links to must not disagree about whether a challenge is open. Kept
 * free of server-only code so client components can import it.
 */

import type { ChallengeWindow } from "@/lib/api/challenge-types";

/** `null` for a missing or unparseable timestamp, so NaN never reaches the UI. */
export function toTime(value?: Date | string | null) {
  if (!value) return null;

  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : null;
}

/**
 * Fails closed: no usable unlock time reads as upcoming, so a challenge is
 * never shown as open on the strength of a timestamp we couldn't parse.
 */
export function resolveWindow(
  now: number,
  unlocksAt: number | null,
  endsAt: number | null,
): ChallengeWindow {
  if (unlocksAt === null || unlocksAt > now) return "upcoming";
  if (endsAt !== null && endsAt <= now) return "closed";
  return "open";
}

/** `resolveWindow` against the current clock, for callers holding raw fields. */
export function windowFor(
  unlocksAt?: Date | string | null,
  endsAt?: Date | string | null,
): ChallengeWindow {
  return resolveWindow(Date.now(), toTime(unlocksAt), toTime(endsAt));
}
