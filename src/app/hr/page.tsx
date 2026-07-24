import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { listTeams } from "@/lib/api/teams";
import { TeamActions } from "@/components/hr/team-actions";

const STATUS_STYLES: Record<string, string> = {
  accepted: "bg-green-500/15 text-green-700",
  rejected: "bg-red-500/15 text-red-700",
  pending: "bg-yellow-500/15 text-yellow-700",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  );
}

/** HR view: one card per team, listing that team's members. */
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {teams.map((team) => (
          <section
            key={team.id}
            className="flex flex-col rounded-xl border border-border bg-card p-4 shadow-sm"
          >
            <header className="mb-3 flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h2 className="truncate font-heading text-lg font-bold capitalize">
                  {team.name}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {team.members.length} member{team.members.length === 1 ? "" : "s"}
                  {" · "}
                  <span className="font-mono">{team.id.slice(0, 8)}</span>
                </p>
              </div>
              <StatusBadge status={team.status} />
            </header>

            <ul className="flex flex-1 flex-col divide-y divide-border">
              {team.members.map((m) => (
                <li
                  key={m.registration_id}
                  className="flex items-center justify-between gap-2 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{m.full_name}</p>
                    <p className="truncate text-xs text-muted-foreground">{m.email}</p>
                  </div>
                  <StatusBadge status={m.status} />
                </li>
              ))}
            </ul>

            <TeamActions teamId={team.id} />
          </section>
        ))}
      </div>
    </main>
  );
}
