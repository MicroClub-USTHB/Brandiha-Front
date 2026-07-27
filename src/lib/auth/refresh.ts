import { API_BASE_URL } from "@/lib/api/base-url";
import { isTokenPair, type TokenPair } from "@/lib/auth/jwt";

/** How long to wait on the backend before giving up and retrying next request. */
const REFRESH_TIMEOUT_MS = 5_000;

/**
 * How long a completed rotation stays replayable under the token that produced
 * it. See `refreshSession` — this is what stops parallel requests from
 * cannibalising each other's tokens.
 */
const GRACE_WINDOW_MS = 10_000;

/** Ceiling on tracked rotations, so a burst of logins can't grow the map unbounded. */
const MAX_TRACKED = 500;

export type RefreshOutcome =
  /** Rotation succeeded; these tokens must be persisted to the browser. */
  | { status: "refreshed"; tokens: TokenPair }
  /** The backend rejected the token (revoked, expired, unknown) — the session is over. */
  | { status: "rejected" }
  /** We couldn't get an answer (timeout, network, 5xx). Keep the cookies and retry later. */
  | { status: "unavailable" };

type Entry = { promise: Promise<RefreshOutcome>; expiresAt: number };

/**
 * Keyed by the *old* refresh token: while a rotation is in flight it holds the
 * shared promise, and after a successful rotation it holds the result for
 * `GRACE_WINDOW_MS`.
 */
const rotations = new Map<string, Entry>();

function sweep(now: number) {
  for (const [token, entry] of rotations) {
    if (entry.expiresAt <= now) rotations.delete(token);
  }
  // Still over budget (many distinct tokens, all live) → drop oldest-first.
  while (rotations.size > MAX_TRACKED) {
    const oldest = rotations.keys().next();
    if (oldest.done) break;
    rotations.delete(oldest.value);
  }
}

async function requestRefresh(refreshToken: string): Promise<RefreshOutcome> {
  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
      signal: AbortSignal.timeout(REFRESH_TIMEOUT_MS),
      cache: "no-store",
    });
  } catch {
    // Network error or timeout — indistinguishable from a backend blip, and
    // never a reason to end a session that may well be valid.
    return { status: "unavailable" };
  }

  // Only an explicit auth rejection ends the session. A 5xx is the backend's
  // problem, not the user's, and must not log everyone out.
  if (res.status === 401 || res.status === 403) return { status: "rejected" };
  if (!res.ok) return { status: "unavailable" };

  let body: unknown;
  try {
    body = await res.json();
  } catch {
    return { status: "unavailable" };
  }

  if (!isTokenPair(body)) return { status: "unavailable" };
  return { status: "refreshed", tokens: body };
}

/**
 * Exchange a refresh token for a fresh pair, collapsing concurrent attempts.
 *
 * The backend rotates strictly: the presented token is deleted the moment it is
 * accepted. But a single navigation can put several requests through the proxy
 * at once (RSC prefetches, parallel route segments), each carrying the same
 * cookie because the browser hasn't seen the new one yet. Left alone, the first
 * would rotate and the rest would get a 401 for a token that was valid when
 * they read it — logging the user out mid-navigation.
 *
 * So a rotation is cached under the token that produced it: in-flight callers
 * await the same request, and callers arriving within `GRACE_WINDOW_MS` of a
 * success get the same new pair back instead of spending the dead token.
 *
 * This is per-instance memory, so it de-duplicates within one middleware worker
 * rather than across a fleet. That covers the case this race actually arises
 * from — one browser's requests landing together. A complete fix belongs in the
 * backend, which could accept a just-rotated token briefly and re-issue its
 * successor.
 */
export function refreshSession(refreshToken: string): Promise<RefreshOutcome> {
  const now = Date.now();
  sweep(now);

  const cached = rotations.get(refreshToken);
  if (cached) return cached.promise;

  const promise = requestRefresh(refreshToken).then((outcome) => {
    const entry = rotations.get(refreshToken);
    if (entry) {
      // Hold a success open for the grace window; drop anything else so the
      // next request gets a real retry rather than a cached failure.
      if (outcome.status === "refreshed") entry.expiresAt = Date.now() + GRACE_WINDOW_MS;
      else rotations.delete(refreshToken);
    }
    return outcome;
  });

  rotations.set(refreshToken, { promise, expiresAt: now + REFRESH_TIMEOUT_MS + GRACE_WINDOW_MS });
  return promise;
}
