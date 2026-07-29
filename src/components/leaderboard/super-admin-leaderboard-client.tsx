"use client";

import { useMemo, useState } from "react";
import LeaderboardComponent from "./leaderboard";
import { AdminLeaderboardEntry } from "@/lib/api/leaderboard";
import { ChallengeScoreSheet } from "@/components/leaderboard/challenge-score-sheet";

function sortLeaderboardByScore(data: AdminLeaderboardEntry[]): AdminLeaderboardEntry[] {
  return [...data].sort((a, b) => b.total_score - a.total_score);
}

export function SuperAdminLeaderboardClient({
  leaderboardData,
}: {
  leaderboardData: AdminLeaderboardEntry[];
}) {
  const [teams, setTeams] = useState(leaderboardData);

  const sortedTeams = useMemo(() => sortLeaderboardByScore(teams), [teams]);

  const handleSave = async (updatedTeam: AdminLeaderboardEntry) => {
    setTeams((current) =>
      current.map((team) => (team.team_id === updatedTeam.team_id ? updatedTeam : team)),
    );
  };

  return (
      <LeaderboardComponent
        leaderboardData={sortedTeams}
        renderAction={(team) => (
          <ChallengeScoreSheet team={team} onSave={handleSave} />
        )}
      />
    );
}