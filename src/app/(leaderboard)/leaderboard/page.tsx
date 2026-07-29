import LeaderboardComponent from "@/components/leaderboard/leaderboard";
import {
  getGlobalLeaderboard,
  PublicLeaderboardEntry,
} from "@/lib/api/leaderboard";

export function sortLeaderboardByScore(
  data: PublicLeaderboardEntry[],
): PublicLeaderboardEntry[] {
  return [...data].sort((a, b) => b.total_score - a.total_score);
}
export default async function Leaderboard() {
  const leaderboardData: PublicLeaderboardEntry[] =
    await getGlobalLeaderboard();
  const sortedLeaderboardData = sortLeaderboardByScore(leaderboardData);
  console.log("Leaderboard Data:", leaderboardData);

  if (!leaderboardData || leaderboardData.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <p className="text-xl font-heading text-black">
          No leaderboard available at the moment.
        </p>
      </div>
    );
  }
  return (
    <div className="flex flex-col items-center justify-start gap-2 min-h-screen">
      <h1 className="text-8xl font-heading text-white font-bold mb-4">
        Leaderboard
      </h1>
      <LeaderboardComponent leaderboardData={sortedLeaderboardData} />
    </div>
  );
}
