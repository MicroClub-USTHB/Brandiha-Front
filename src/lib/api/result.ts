/**
 * The serializable shapes every Server Action hands back to the client. Errors
 * are returned, never thrown across the boundary, and `error` is user-facing
 * copy.
 *
 * Kept free of server-only code so client components can import these types.
 */

/** A failed call, with the message to show the user. */
export type Failure = { ok: false; error: string };

/** A read: the data on success, a message on failure. */
export type FetchResult<T> = { ok: true; data: T } | Failure;

/** A mutation with no returned payload: a success flag, or a message. */
export type ActionResult = { ok: true } | Failure;
