import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { listTeams } from "@/lib/api/teams";
import { HrBoard } from "@/components/hr/hr-board";

/** HR view: one card per team, with drag-and-drop to move members between teams. */
export default async function HrPage() {
  const session = await getSession();
  if (!session) redirect("/login?from=/hr");

  const result = await listTeams();
  if (!result.ok) {
    return (
      <main className="mx-auto max-w-6xl p-6">
        <p className="font-sans text-destructive">{result.error}</p>
      </main>
    );
  }

  const teams = result.data;

  return (
    <main className="mx-auto max-w-6xl p-6 font-sans">
      <h1 className="mb-6 font-heading text-2xl font-extrabold uppercase tracking-wide text-white">
        Teams <span className="text-white/60">({teams.length})</span>
      </h1>
      <HrBoard teams={teams} />
    </main>
  );
}
