"use server";

import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";

import { authedAction, authedJson } from "@/lib/api/authed";
import { backendFetch } from "@/lib/api/fetch";
import type {
  AdminLeaderboardResponse,
  PublicLeaderboardEntry,
  PublicLeaderboardResponse,
  ScoreUpdate,
} from "@/lib/api/leaderboard-types";
import type { ActionResult, FetchResult } from "@/lib/api/result";

type Board<Entry> = {
  frozen: boolean;
  frozen_at: string | null;
  leaderboard: Entry[];
};

/**
 * Both boards read the same way when the body is missing a field: empty and
 * unfrozen, rather than crashing the page.
 */
function withBoardDefaults<Entry>(board: Partial<Board<Entry>>): Board<Entry> {
  return {
    frozen: board.frozen ?? false,
    frozen_at: board.frozen_at ?? null,
    leaderboard: board.leaderboard ?? [],
  };
}

/**
 * Uncached on purpose, which also opts `/leaderboard` out of static generation.
 * Prerendered, the public board froze at whatever the backend answered during
 * the build — so scores never moved, and a build run while the backend was down
 * shipped an empty table. Same reasoning as `getPublicChallenges`.
 */
export async function getGlobalLeaderboard(): Promise<PublicLeaderboardResponse> {
  try {
    const response = await backendFetch("/leaderboard", {
      method: "GET",
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`http Error: ${response.status}`);
    }

    return withBoardDefaults<PublicLeaderboardEntry>(await response.json());
  } catch (error) {
    // Next signals "this route can't be static" by throwing, and a bare catch
    // here swallows that signal along with real failures. Hand it back before
    // treating the error as a backend problem.
    unstable_rethrow(error);
    console.error("Unable to retrieve the leaderboard:", error);
    return { frozen: false, frozen_at: null, leaderboard: [] };
  }
}

// The admin board, scoring, and the freeze are all `get_current_super_admin`
// on the backend.

/** Server Action: every team with its per-challenge scores (Super Admin). */
export async function getAdminLeaderboard(): Promise<FetchResult<AdminLeaderboardResponse>> {
  const result = await authedJson<AdminLeaderboardResponse>(["super_admin"], "/admin/leaderboard", {
    forbidden: "You're not authorized to see the leaderboard.",
    fallback: "Something went wrong loading the leaderboard.",
  });
  if (!result.ok) return result;
  return { ok: true, data: withBoardDefaults(result.data) };
}

/**
 * Server Action: score or rescore submissions in one request via
 * `PATCH /admin/challenge-submissions` (Super Admin).
 */
export async function updateScores(scores: ScoreUpdate[]): Promise<ActionResult> {
  return authedAction(
    ["super_admin"],
    "/admin/challenge-submissions",
    {
      forbidden: "You're not authorized to change scores.",
      byStatus: { 422: "Some scores were rejected. Scores must be 0 or more." },
      fallback: "Something went wrong saving the scores.",
    },
    { method: "PATCH", body: JSON.stringify(scores) },
  );
}

/**
 * Server Action: freeze or unfreeze the leaderboard (Super Admin). Returns the
 * state it landed in, and refreshes both boards so neither shows the old one.
 */
export async function toggleLeaderboardFreeze(): Promise<FetchResult<{ frozen: boolean }>> {
  const result = await authedJson<{ frozen: boolean }>(
    ["super_admin"],
    "/admin/freeze",
    {
      forbidden: "You're not authorized to freeze the leaderboard.",
      fallback: "Something went wrong changing the leaderboard freeze.",
    },
    { method: "POST" },
  );

  if (result.ok) {
    revalidatePath("/super-admin-leaderboard");
    revalidatePath("/leaderboard");
  }
  return result;
}
