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

export type BulkScoreUpdatePayload = {
  submission_id: string;
  score: number;
};

export const dummyLeaderboardData: PublicLeaderboardEntry[] = [
  {
    team_name: "mouss w yakuza",
    total_score: 2,
  },
  {
    team_name: "berbochi",
    total_score: 8999,
  },
  {
    team_name: "mottenmenschen",
    total_score: 2015,
  },
  {
    team_name: "los galacticos",
    total_score: 140,
  },
];

export async function getGlobalLeaderboard(): Promise<PublicLeaderboardEntry[]> {
  try {
    const response = await publicApiFetch("leaderboard", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`http Error: ${response.status}`);
    }
    const data: PublicLeaderboardEntry[] = await response.json();
    if(data.length === 0) {
        return dummyLeaderboardData;
    }
    return data;
  } catch (error) {
    console.error("Unable to retrieve the leaderboard:", error);
    return [];
  }
}

export async function getAdminLeaderboard(): Promise<AdminLeaderboardEntry[]> {
  const res = await apiFetch("/admin/leaderboard");
  if (!res.ok) throw new Error("Error retrieving the admin leaderboard");
  
  const data: AdminLeaderboardEntry[] = await res.json();
  if(data.length === 0) {
    return dummyLeaderboardData.map(entry => ({
      team_id: "dummy",
      team_name: entry.team_name,   
      per_challenge: [],
      total_score: entry.total_score,
    }));
  }
  return data;
}

export async function bulkUpdateScores(
  payload: BulkScoreUpdatePayload[]
): Promise<void> {
  const res = await apiFetch("/admin/challenge-submissions", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(
      errorData?.detail?.[0]?.msg || "Failed to update challenge scores"
    );
  }
}