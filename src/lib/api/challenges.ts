"use server";

import { publicApiFetch } from "@/lib/api/publicApiFetch";
import { windowFor } from "@/lib/api/challenge-window";
import { apiFetch, UnauthenticatedError } from "@/lib/api/client";
import { requireRole } from "@/lib/auth/session";
import type { FetchResult } from "@/lib/api/registrations";
import type {
  Challenge,
  ChallengeDetail,
  ChallengeStatus,
} from "@/lib/api/challenge-types";
import type { SubmissionFormData } from "@/lib/validators/submission-schema";

/** Result returned to the client — errors are serialized, never thrown across the boundary. */
export type SubmitResult = { ok: true } | { ok: false; error: string };

/**
 * Server Action: the public challenge list via `GET /challenges`.
 *
 * The single place this endpoint is fetched — `getChallenge` selects from it
 * rather than issuing its own call, so the cache policy and error handling
 * can't drift between the two.
 *
 * Uncached on purpose: `unlocks_at`/`ends_at` decide whether a challenge is
 * open, and a cached list would keep reporting "closed" past the unlock time.
 *
 * Sorted by unlock time here rather than in each page, so the two grids can't
 * present the same list in two different orders.
 */
export async function getPublicChallenges(): Promise<FetchResult<Challenge[]>> {
  let response: Response;

  try {
    response = await publicApiFetch("/challenges", { cache: "no-store" });
  } catch {
    return { ok: false, error: "Couldn't reach the server. Please try again in a moment." };
  }

  if (!response.ok)
    return { ok: false, error: "Something went wrong loading the challenges." };

  try {
    const data = await response.json() as Challenge[];
    return { ok: true, data: byUnlockTime(data) };
  } catch {
    return { ok: false, error: "Something went wrong loading the challenges." };
  }
}

/**
 * Earliest unlock first, so a grid reads as a timeline: what is already open,
 * then what unlocks next. The backend returns no particular order.
 *
 * An unparseable `unlocks_at` sorts last instead of poisoning the comparison
 * with NaN, which would leave the whole list in an arbitrary order.
 */
function byUnlockTime(challenges: Challenge[]): Challenge[] {
  const unlockTime = (challenge: Challenge) => {
    const time = new Date(challenge.unlocks_at).getTime();
    return Number.isFinite(time) ? time : Infinity;
  };

  return [...challenges].sort((a, b) => unlockTime(a) - unlockTime(b));
}

/**
 * Server Action: one challenge by id, with its current submission window.
 *
 * Selects from the public list because there is no public
 * `GET /challenges/{id}` — the detail endpoint is staff-only. The window is
 * derived here rather than in the page: it depends on the clock, and reading
 * the clock during render is impure.
 */
export async function getChallenge(id: number): Promise<FetchResult<ChallengeStatus>> {
  const result = await getPublicChallenges();
  if (!result.ok) return result;

  const challenge = result.data.find((c) => c.id === id);
  if (!challenge) return { ok: false, error: "That challenge doesn't exist." };

  return {
    ok: true,
    data: { challenge, window: windowFor(challenge.unlocks_at, challenge.ends_at) },
  };
}

/**
 * Server Action: submit a team's solution to a challenge. Public — the team's
 * `secret_code` is the credential, so there is no bearer token and no session.
 *
 * The backend runs its checks in a fixed order and each failure gets its own
 * status, so they map one-to-one onto messages. `404` is the one ambiguity: it
 * covers both "no such challenge" and "no such team code", but the page has
 * already resolved the challenge before rendering the form, so by the time this
 * runs it can only mean the code.
 */
export async function submitChallenge(
  challengeId: number,
  data: SubmissionFormData,
): Promise<SubmitResult> {
  let response: Response;
  try {
    response = await publicApiFetch(`/challenges/${challengeId}`, {
      method: "POST",
      body: JSON.stringify({
        team_code: data.TeamCode.trim(),
        link: data.Link.trim(),
      }),
    });
  } catch {
    return {
      ok: false,
      error: "Couldn't reach the server. Please try again in a moment.",
    };
  }

  if (response.ok) return { ok: true };

  // Both "not unlocked yet" and "already ended" come back as 400, so the copy
  // has to cover the pair; the page header shows which one it actually is.
  if (response.status === 400) {
    return { ok: false, error: "This challenge isn't open for submissions right now." };
  }

  if (response.status === 403) {
    return { ok: false, error: "Your team hasn't been accepted, so it can't submit." };
  }

  if (response.status === 404) {
    return { ok: false, error: "We couldn't find a team with that code." };
  }

  if (response.status === 409) {
    return { ok: false, error: "Your team has already submitted to this challenge." };
  }

  if (response.status === 422) {
    return {
      ok: false,
      error: "Some details were rejected by the server. Please check your code and link.",
    };
  }

  return {
    ok: false,
    error: "Something went wrong on our side. Please try again in a moment.",
  };
}

/**
 * Server Action: fetch a challenge and every submission against it via
 * `GET /challenges/{id}`.
 *
 * Mirrors the backend's `get_current_staff`, which admits `admin` and
 * `super_admin` but not `alumni`. Roles are disjoint there — `super_admin` is
 * not a superset of `admin` — so both are named explicitly.
 */
export async function getChallengeDetail(
  id: number,
): Promise<FetchResult<ChallengeDetail>> {
  const denied = await requireRole("admin", "super_admin");
  if (denied) return denied;

  try {
    const res = await apiFetch(`/challenges/${id}`);
    if (res.status === 401 || res.status === 403)
      return { ok: false, error: "You're not authorized to view this." };
    if (res.status === 404) return { ok: false, error: "That challenge doesn't exist." };
    if (!res.ok) return { ok: false, error: "Something went wrong loading this challenge." };
    return { ok: true, data: (await res.json()) as ChallengeDetail };
  } catch (e) {
    if (e instanceof UnauthenticatedError) return { ok: false, error: "You're not signed in." };
    return { ok: false, error: "Couldn't reach the server." };
  }
}
