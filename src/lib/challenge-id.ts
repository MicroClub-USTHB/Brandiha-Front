/**
 * The `[challenge-id]` route segment as a challenge id, or `null` when it
 * can't be one. Challenge ids are SERIAL integers on the backend, not uuids,
 * so anything but a positive safe integer is a 404 before a request is made.
 */
export function parseChallengeId(raw: string): number | null {
  if (!/^\d+$/.test(raw)) return null;
  const id = Number(raw);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
