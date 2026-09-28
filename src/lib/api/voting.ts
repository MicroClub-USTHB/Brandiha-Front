"use server";

import { authedAction, authedJson } from "@/lib/api/authed";
import type { ActionResult, FetchResult } from "@/lib/api/result";
import type {
  AlumniLeaderboardEntry,
  AlumniVote,
  VotingStatus,
} from "@/lib/api/alumni-types";

/**
 * Server Action: the alumni's ballot via `GET /alumni/voting` — every accepted
 * team, plus whether this alumni has voted already.
 *
 * `alumni` alone, mirroring `get_current_alumni_only`: a `super_admin` reads the
 * tallied result (`/alumni/leaderboard`) and is rejected here.
 */
export async function getVotingStatus(): Promise<FetchResult<VotingStatus>> {
  return authedJson(["alumni"], "/alumni/voting", {
    forbidden: "You're not authorized to vote.",
    fallback: "Something went wrong loading the ballot.",
  });
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
  return authedAction(
    ["alumni"],
    "/alumni/voting",
    {
      forbidden: "You're not authorized to vote.",
      byStatus: {
        400: "The list of teams changed while you were ranking. Reload and try again.",
        409: "Your vote is already recorded, and it can't be changed.",
      },
      fallback: "Something went wrong submitting your vote.",
    },
    { method: "POST", body: JSON.stringify({ ranked_team_ids: rankedTeamIds }) },
  );
}

/**
 * Server Action: the tallied Borda board via `GET /alumni/leaderboard`, already
 * sorted by score descending on the backend.
 *
 * `super_admin` alone, mirroring `get_current_super_admin`: the alumni who cast
 * the votes are rejected here, the same way a `super_admin` is rejected at the
 * ballot.
 */
export async function getAlumniLeaderboard(): Promise<FetchResult<AlumniLeaderboardEntry[]>> {
  return authedJson(["super_admin"], "/alumni/leaderboard", {
    forbidden: "You're not authorized to see the vote leaderboard.",
    fallback: "Something went wrong loading the vote leaderboard.",
  });
}

/**
 * Server Action: every alumni's ballot via `GET /alumni/votes` — the audit trail
 * the Borda board is computed from, grouped by alumni with their teams in rank
 * order. `super_admin` alone, as above.
 */
export async function getAlumniVotes(): Promise<FetchResult<AlumniVote[]>> {
  return authedJson(["super_admin"], "/alumni/votes", {
    forbidden: "You're not authorized to see the vote results.",
    fallback: "Something went wrong loading the vote results.",
  });
}
