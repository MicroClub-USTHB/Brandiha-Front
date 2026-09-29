/**
 * The score sheet edits scores as input text, where an unscored submission
 * (`score: null` from the backend) is an empty box. These convert between the
 * two so an empty box never saves as `0` — it used to, because `Number("")` is
 * `0`, which turned every untouched unscored submission into a zero.
 */

/** A score as the input shows it: empty when unscored. */
export function scoreToDraft(score: number | null): string {
  return score === null ? "" : String(score);
}

/**
 * What a draft saves as: a number of 0 or more is the new score, and anything
 * else — an empty box included — keeps `previous`.
 *
 * Empty means "no change" rather than "clear the score" because the backend
 * can't clear one: `PATCH /admin/challenge-submissions` skips a `null` score
 * (a documented limitation on its side), so sending one would look like it
 * worked until the next reload brought the old score back.
 */
export function draftToScore(draft: string, previous: number | null): number | null {
  if (draft.trim() === "") return previous;
  const score = Number(draft);
  return Number.isFinite(score) && score >= 0 ? score : previous;
}
