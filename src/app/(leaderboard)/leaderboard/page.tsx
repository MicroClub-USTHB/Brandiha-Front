import {
  getGlobalLeaderboard,
  PublicLeaderboardEntry,
  PublicLeaderboardResponse,
} from "@/lib/api/leaderboard";
import LeaderboardComponent from "@/components/leaderboard/leaderboard";

export function sortLeaderboardByScore(
  data: PublicLeaderboardEntry[]
): PublicLeaderboardEntry[] {
  return [...data].sort((a, b) => b.total_score - a.total_score);
}

export default async function Leaderboard() {
  const leaderboardResponse: PublicLeaderboardResponse = await getGlobalLeaderboard();

  const sortedLeaderboardData = sortLeaderboardByScore(leaderboardResponse.leaderboard);

  return (
    <div className="flex min-h-screen flex-col items-center justify-start gap-4 p-6">
      {leaderboardResponse.frozen ? (
        <h1 className="mb-4 text-8xl font-bold font-heading text-white">Leaderboard (frozen)</h1>
      ) :(
        <h1 className="mb-4 text-8xl font-bold font-heading text-white">Leaderboard</h1>
      
      )}

      <LeaderboardComponent leaderboardData={sortedLeaderboardData} />
    </div>
  );
}