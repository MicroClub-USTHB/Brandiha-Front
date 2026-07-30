import { publicApiFetch } from "./publicApiFetch";
import { apiFetch } from "./client";

export type PublicLeaderboardEntry = {
  team_name: string;
  total_score: number;
};

export type ChallengeScore = {
  challenge_id: number;
  challenge_title: string;
  score: number;
  submission_id: string;
};

export type AdminLeaderboardEntry = {
  team_id: string;
  team_name: string;
  per_challenge: ChallengeScore[];
  total_score: number;
};

export type PublicLeaderboardResponse = {
  frozen: boolean;
  frozen_at: string | null;
  leaderboard: PublicLeaderboardEntry[];
};

export type AdminLeaderboardResponse = {
  frozen: boolean;
  frozen_at: string | null;
  leaderboard: AdminLeaderboardEntry[];
};

export type BulkScoreUpdatePayload = {
  submission_id: string;
  score: number;
};

export const dummyLeaderboardData: PublicLeaderboardEntry[] = [
  { team_name: "mouss w yakuza", total_score: 2 },
  { team_name: "berbochi", total_score: 8999 },
  { team_name: "mottenmenschen", total_score: 2015 },
  { team_name: "los galacticos", total_score: 140 },
];

export async function getGlobalLeaderboard(): Promise<PublicLeaderboardResponse> {
  try {
    const response = await publicApiFetch("leaderboard", { method: "GET" });

    if (!response.ok) {
      throw new Error(`http Error: ${response.status}`);
    }

    const data: PublicLeaderboardResponse = await response.json();
    
    if (!data.leaderboard || data.leaderboard.length === 0) {
      return {
        frozen: data.frozen ?? false,
        frozen_at: data.frozen_at ?? null,
        leaderboard: dummyLeaderboardData,
      };
    }

    return data;
  } catch (error) {
    console.error("Unable to retrieve the leaderboard:", error);
    return { frozen: false, frozen_at: null, leaderboard: [] };
  }
}

export async function getAdminLeaderboard(): Promise<AdminLeaderboardResponse> {
  const res = await apiFetch("/admin/leaderboard");
  if (!res.ok) throw new Error("Error retrieving the admin leaderboard");

  const data: AdminLeaderboardResponse = await res.json();
  if (!data.leaderboard || data.leaderboard.length === 0) {
    return {
      frozen: data.frozen ?? false,
      frozen_at: data.frozen_at ?? null,
      leaderboard: dummyLeaderboardData.map((entry) => ({
        team_id: "dummy",
        team_name: entry.team_name,
        per_challenge: [],
        total_score: entry.total_score,
      })),
    };
  }

  return data;
}

export async function toggleLeaderboardFreezeApi(): Promise<{ frozen: boolean }> {
  const res = await apiFetch("/admin/freeze", {
    method: "POST",
  });
  if (!res.ok) {
    throw new Error(`Failed to toggle freeze state: ${res.status}`);
  }

  return res.json();
}