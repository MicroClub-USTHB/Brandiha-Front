"use client";

import { useMemo, useState } from "react";
import LeaderboardComponent from "./leaderboard";
import type { AdminLeaderboardEntry } from "@/lib/api/leaderboard-types";
import { ChallengeScoreSheet } from "@/components/leaderboard/challenge-score-sheet";
import { byScore } from "@/lib/leaderboard-order";

interface SuperAdminLeaderboardClientProps {
  initialLeaderboard: AdminLeaderboardEntry[];
  isFrozen?: boolean;
  frozenAt?: string | null;
}

export function SuperAdminLeaderboardClient({
  initialLeaderboard,
}: SuperAdminLeaderboardClientProps) {
  const [teams, setTeams] = useState(initialLeaderboard);

  const sortedTeams = useMemo(() => byScore(teams), [teams]);

  const handleSaveSuccess = (updatedTeam: AdminLeaderboardEntry) => {
    setTeams((current) =>
      current.map((team) => (team.team_id === updatedTeam.team_id ? updatedTeam : team)),
    );
  };

  return (
    <LeaderboardComponent
      leaderboardData={sortedTeams}
      renderAction={(team) => (
        <ChallengeScoreSheet team={team} onSaveSuccess={handleSaveSuccess} />
      )}
    />
  );
}