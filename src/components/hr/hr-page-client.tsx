"use client";

import { useMemo, useState } from "react";
import type { TeamStats } from "@/lib/api/team-types";
import type { Team } from "@/lib/api/team-types";
import type { RegistrationStatus } from "@/lib/api/registration-types";
import { TeamStatsBar } from "@/components/hr/team-stats-bar";
import { HrBoard } from "@/components/hr/hr-board";
import { ExportCsvButton } from "@/components/hr/export-csv-button";

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
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-wide text-white">
          Teams <span className="text-white/60">({teams.length})</span>
        </h1>
        <ExportCsvButton disabled={teams.length === 0} filter={filter} />
      </div>

      <TeamStatsBar stats={stats} filter={filter} onFilterChange={setFilter} />
      <HrBoard key={filter ?? "all"} teams={filtered} />
    </>
  );
}
