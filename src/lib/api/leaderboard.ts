import { publicApiFetch } from "./publicApiFetch";

export type LeaderboardEntry = {
  team_name: string;
  total_score: number;
};

export const dummyLeaderboardData: LeaderboardEntry[] = [
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

export async function getGlobalLeaderboard(): Promise<LeaderboardEntry[]> {
  try {
    const response = await publicApiFetch("leaderboard", {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error(`http Error: ${response.status}`);
    }
    const data: LeaderboardEntry[] = await response.json();
    if(data.length === 0) {
        return dummyLeaderboardData;
    }
    return data;
  } catch (error) {
    console.error("Impossible de récupérer le leaderboard :", error);
    return [];
  }
}