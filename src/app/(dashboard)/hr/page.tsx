import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { getTeamStats, listTeams } from "@/lib/api/teams";
import { HrPageClient } from "@/components/hr/hr-page-client";

/** HR view: one card per team, with drag-and-drop to move members between teams. */
export default async function HrPage() {
  const session = await getSession();
  if (!session) redirect("/login?from=/hr");

  const [statsResult, teamsResult] = await Promise.all([
    getTeamStats(),
    listTeams(),
  ]);

  if (!teamsResult.ok) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <p className="font-sans text-destructive">{teamsResult.error}</p>
      </main>
    );
  }

  const stats = statsResult.ok
    ? statsResult.data
    : { total_teams: 0, pending_teams: 0, accepted_teams: 0, rejected_teams: 0 };

  return (
    <main className="mx-auto max-w-6xl p-6 font-sans">
      <HrPageClient stats={stats} teams={teamsResult.data} />
    </main>
  );
}
