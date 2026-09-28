import { unstable_rethrow } from "next/navigation";

import { backendFetch } from "@/lib/api/fetch";
import type {
  AdminLeaderboardResponse,
  PublicLeaderboardResponse,
} from "@/lib/api/leaderboard-types";

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

    const data: PublicLeaderboardResponse = await response.json();
    
    if (!data.leaderboard) {
      return {
        frozen: data.frozen ?? false,
        frozen_at: data.frozen_at ?? null,
        leaderboard: [],
      };
    }

    return data;
  } catch (error) {
    // Next signals "this route can't be static" by throwing, and a bare catch
    // here swallows that signal along with real failures. Hand it back before
    // treating the error as a backend problem.
    unstable_rethrow(error);
    console.error("Unable to retrieve the leaderboard:", error);
    return { frozen: false, frozen_at: null, leaderboard: [] };
  }
}

export async function getAdminLeaderboard(): Promise<AdminLeaderboardResponse> {
  const res = await backendFetch("/admin/leaderboard", { auth: true });
  if (!res.ok) throw new Error("Error retrieving the admin leaderboard");

  const data: AdminLeaderboardResponse = await res.json();
  if (!data.leaderboard) {
    return {
      frozen: data.frozen ?? false,
      frozen_at: data.frozen_at ?? null,
      leaderboard: [],
    };
  }

  return data;
}

export async function toggleLeaderboardFreezeApi(): Promise<{ frozen: boolean }> {
  const res = await backendFetch("/admin/freeze", {
    auth: true,
    method: "POST",
  });
  if (!res.ok) {
    throw new Error(`Failed to toggle freeze state: ${res.status}`);
  }

  return res.json();
}