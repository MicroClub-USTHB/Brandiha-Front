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
      <h1 className="text-6xl font-bold font-heading text-white">Leaderboard</h1>

      {leaderboardResponse.frozen && (
        <div className="w-full max-w-7xl rounded-lg bg-cyan-500/20 px-4 py-2 text-cyan-200 border border-cyan-500/40 text-sm text-center">
          ❄️ Les scores sont actuellement gelés !
        </div>
      )}

      <LeaderboardComponent leaderboardData={sortedLeaderboardData} />
    </div>
  );
}