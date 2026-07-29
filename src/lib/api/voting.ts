"use server";

import { apiFetch, UnauthenticatedError } from "@/lib/api/client";
import { requireRole } from "@/lib/auth/session";
import type { FetchResult } from "@/lib/api/registrations";
import type { ActionResult } from "@/lib/api/teams";
import type { VotingStatus } from "@/lib/api/alumni-types";

/**
 * Server Action: the alumni's ballot via `GET /alumni/voting` — every accepted
 * team, plus whether this alumni has voted already.
 *
 * `alumni` alone, mirroring `get_current_alumni_only`: a `super_admin` reads the
 * tallied result (`/alumni/leaderboard`) and is rejected here.
 */
export async function getVotingStatus(): Promise<FetchResult<VotingStatus>> {
  const denied = await requireRole("alumni");
  if (denied) return denied;

  try {
    const res = await apiFetch("/alumni/voting");
    if (res.status === 401 || res.status === 403)
      return { ok: false, error: "You're not authorized to vote." };
    if (!res.ok) return { ok: false, error: "Something went wrong loading the ballot." };
    return { ok: true, data: (await res.json()) as VotingStatus };
  } catch (e) {
    if (e instanceof UnauthenticatedError) return { ok: false, error: "You're not signed in." };
    return { ok: false, error: "Couldn't reach the server." };
  }
}

/**
 * Server Action: cast the Borda vote via `POST /alumni/voting`. `rankedTeamIds`
 * is every active team exactly once, 1st preference first — the backend rejects
 * a partial or padded list with `400`.
 *
 * The `409` is the backend refusing a *second* vote. The ballot locks itself
 * once a ranking is on record, so this only fires when that record was made
 * elsewhere — another tab, or a session open since before the vote. Surfaced as
 * its own message rather than a generic failure: nothing was lost, and there is
 * nothing to retry.
 */
export async function submitVote(rankedTeamIds: string[]): Promise<ActionResult> {
  const denied = await requireRole("alumni");
  if (denied) return denied;

  try {
    const res = await apiFetch("/alumni/voting", {
      method: "POST",
      body: JSON.stringify({ ranked_team_ids: rankedTeamIds }),
    });
    if (res.status === 401 || res.status === 403)
      return { ok: false, error: "You're not authorized to vote." };
    if (res.status === 409)
      return {
        ok: false,
        error: "Your vote is already recorded, and it can't be changed.",
      };
    if (res.status === 400)
      return {
        ok: false,
        error: "The list of teams changed while you were ranking. Reload and try again.",
      };
    if (!res.ok) return { ok: false, error: "Something went wrong submitting your vote." };
    return { ok: true };
  } catch (e) {
    if (e instanceof UnauthenticatedError) return { ok: false, error: "You're not signed in." };
    return { ok: false, error: "Couldn't reach the server." };
  }
}
