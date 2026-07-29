import LeaderboardRow from "./leaderboard-row";
import { getGlobalLeaderboard, PublicLeaderboardEntry, AdminLeaderboardEntry } from "@/lib/api/leaderboard";

export type  LeaderboardProps = {
  leaderboardData: PublicLeaderboardEntry[] | AdminLeaderboardEntry[] ;
};

export default async function LeaderboardComponent({ leaderboardData }: LeaderboardProps) {
  return (
    <div className="flex flex-col items-center justify-center">
      {leaderboardData.map((team, index) => (
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
