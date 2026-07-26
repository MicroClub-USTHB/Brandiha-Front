"use client";

import { useMemo, useState } from "react";
import type { TeamStats } from "@/lib/api/team-types";
import type { Team } from "@/lib/api/team-types";
import type { RegistrationStatus } from "@/lib/api/registration-types";
import { TeamStatsBar } from "@/components/hr/team-stats-bar";
import { HrBoard } from "@/components/hr/hr-board";

export function HrPageClient({
  stats,
  teams,
}: {
  stats: TeamStats;
  teams: Team[];
}) {
  const [filter, setFilter] = useState<RegistrationStatus | null>(null);

  const filtered = useMemo(
    () => (filter ? teams.filter((t) => t.status === filter) : teams),
    [teams, filter],
  );

  return (
    <>
      <TeamStatsBar stats={stats} filter={filter} onFilterChange={setFilter} />
      <HrBoard key={filter ?? "all"} teams={filtered} />
    </>
  );
}
