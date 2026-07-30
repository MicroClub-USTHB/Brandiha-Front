import LeaderboardRow from "./leaderboard-row";
import { PublicLeaderboardEntry } from "@/lib/api/leaderboard";
import { ReactNode } from "react";

export type LeaderboardProps<T extends PublicLeaderboardEntry> = {
  leaderboardData: T[];
  renderAction?: (team: T) => ReactNode;
};

export default function LeaderboardComponent<T extends PublicLeaderboardEntry>({
  leaderboardData,
  renderAction,
}: LeaderboardProps<T>) {
  return (
    <div className="flex flex-col items-center justify-center">
      {leaderboardData.map((team, index) => (
        <LeaderboardRow
          key={`${team.team_name}-${index}`}
          rank={index + 1}
          teamName={team.team_name}
          score={team.total_score}
          actions={renderAction ? renderAction(team) : undefined}
        />
      ))}
    </div>
  );
}