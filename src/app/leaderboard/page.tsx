import { Header } from "@/components/landing/header";
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
    <div className="flex min-h-screen flex-col items-center justify-start gap-4 px-6 pb-6 pt-32">
      <Header />
      {leaderboardResponse.frozen ? (
        <h1 className="mt-8 mb-6 text-4xl lg:text-8xl font-bold font-heading text-white">Leaderboard (frozen)</h1>
      ) :(
        <h1 className="mt-8 mb-6 text-4xl lg:text-8xl font-bold font-heading text-white">Leaderboard</h1>
      
      )}

      <LeaderboardComponent leaderboardData={sortedLeaderboardData} />
      <div className="h-12" />
    </div>
  );
}