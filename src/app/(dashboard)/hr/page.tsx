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

  if (!statsResult.ok) {
    return (
      <main className="mx-auto max-w-6xl p-6 font-sans">
        <h1 className="mb-6 font-heading text-2xl font-extrabold uppercase tracking-wide text-white">
          Teams <span className="text-white/60">({teamsResult.data.length})</span>
        </h1>
        <HrPageClient stats={{ total_teams: 0, pending_teams: 0, accepted_teams: 0, rejected_teams: 0 }} teams={teamsResult.data} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-6 font-sans">
      <h1 className="mb-6 font-heading text-2xl font-extrabold uppercase tracking-wide text-white">
        Teams <span className="text-white/60">({teamsResult.data.length})</span>
      </h1>

      <HrPageClient stats={statsResult.data} teams={teamsResult.data} />
    </main>
  );
}
