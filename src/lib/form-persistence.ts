/**
 * Expiry rule for the in-progress registration form, which is persisted to
 * localStorage so an accidental reload doesn't cost someone their answers.
 *
 * Kept in its own module so it can be tested without importing the hook, which
 * pulls in a Server Action and so can't be loaded outside a request.
 */

/** localStorage key holding the saved form. */
export const REGISTRATION_PERSIST_KEY = "registration-form-storage";

/**
 * How long a half-finished form is kept. Recovering from a reload or a closed
 * tab is a same-sitting concern, so the saved copy expires rather than living
 * in localStorage until the browser is wiped.
 *
 * It matters because of *what* is in there: full name, email, phone number and
 * Discord ID. Someone who starts the form on a shared or public machine and
 * walks away should not leave that behind indefinitely.
 */
export const REGISTRATION_PERSIST_TTL_MS = 24 * 60 * 60 * 1000;

/**
 * Whether a saved copy stamped at `savedAt` is too old to restore.
 *
 * A `null` stamp counts as expired: it is either an empty store or a copy
 * written before this rule existed, and a copy of unknown age is one we can't
 * vouch for.
 */
export function isPersistExpired(
  savedAt: number | null | undefined,
  now: number = Date.now(),
): boolean {
  if (savedAt === null || savedAt === undefined) return true;
  return now - savedAt > REGISTRATION_PERSIST_TTL_MS;
}
