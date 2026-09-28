"use client";

import { useMemo, useState } from "react";
import type { Team } from "@/lib/api/team-types";
import type { RegistrationStatus } from "@/lib/api/registration-types";
import { countTeamsByStatus, teamStatus } from "@/lib/team-status";
import { TeamStatsBar } from "@/components/hr/team-stats-bar";
import { HrBoard } from "@/components/hr/hr-board";
import { ExportCsvButton } from "@/components/hr/export-csv-button";

export function HrPageClient({ teams }: { teams: Team[] }) {
  const [filter, setFilter] = useState<RegistrationStatus | null>(null);

  // Every status on this page is the members' majority (`teamStatus`), the one
  // the badges show — never the backend's own per-team `status`, which can
  // disagree with it. So the counts, the filter, and the export all agree with
  // what's on the cards.
  const counts = useMemo(() => countTeamsByStatus(teams), [teams]);
  const filtered = useMemo(
    () => (filter ? teams.filter((t) => teamStatus(t.members) === filter) : teams),
    [teams, filter],
  );

  return (
    <>
      <div className="mb-6 flex items-center justify-between gap-4">
        <h1 className="font-heading text-2xl font-extrabold uppercase tracking-wide text-white">
          Teams <span className="text-white/60">({teams.length})</span>
        </h1>
        <ExportCsvButton
          disabled={filtered.length === 0}
          teamIds={filter ? filtered.map((t) => t.id) : undefined}
        />
      </div>

      <TeamStatsBar
        total={teams.length}
        counts={counts}
        filter={filter}
        onFilterChange={setFilter}
      />
      <HrBoard key={filter ?? "all"} teams={filtered} />
    </>
  );
}
