import LeaderboardRow from "./leaderboard-row";
import { getGlobalLeaderboard, PublicLeaderboardEntry } from "@/lib/api/public-leaderboard";

export function sortLeaderboardByScore(data: PublicLeaderboardEntry[]): PublicLeaderboardEntry[] {
  return [...data].sort((a, b) => b.total_score - a.total_score);
}

export default async function LeaderboardComponent() {
  const leaderboardData: PublicLeaderboardEntry[] = await getGlobalLeaderboard();
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
    <div className="flex flex-col items-center justify-center">
      {sortedLeaderboardData.map((team, index) => (
        <LeaderboardRow
          key={`${team.team_name}-${index}`}
          rank={index + 1}
          teamName={team.team_name}
          score={team.total_score}
        />
      ))}
    </div>
  );
}
