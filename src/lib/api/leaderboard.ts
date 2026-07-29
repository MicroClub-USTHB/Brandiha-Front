import { publicApiFetch } from "./publicApiFetch";

export type LeaderboardEntry = {
  team_name: string;
  total_score: number;
};

export async function getGlobalLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const response = await publicApiFetch("leaderboard", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`http Error: ${response.status}`);
    }
    const data: LeaderboardEntry[] = await response.json();
    return data;
  } catch (error) {
    console.error("Impossible de récupérer le leaderboard :", error);
    return [];
  }
}