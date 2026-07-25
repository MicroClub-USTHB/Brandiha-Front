"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GripVertical } from "lucide-react";
import { transferRegistration } from "@/lib/api/registrations";
import type { Team } from "@/lib/api/team-types";
import { StatusBadge } from "@/components/hr/status-badge";
import { TeamActions } from "@/components/hr/team-actions";
import { cn } from "@/lib/utils";

type Dragged = {
  registrationId: string;
  memberName: string;
  fromTeamId: string;
  fromTeamName: string;
};

/** HR board: cards per team with drag-and-drop to move a member between teams. */
export function HrBoard({ teams }: { teams: Team[] }) {
  const router = useRouter();
  const [dragged, setDragged] = useState<Dragged | null>(null);
  const [overTeamId, setOverTeamId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleDrop = async (team: Team) => {
    setOverTeamId(null);
    const d = dragged;
    setDragged(null);
    // Nothing to do when dropped back onto the member's own team.
    if (!d || d.fromTeamId === team.id) return;

    const confirmed = window.confirm(
      `Move ${d.memberName} from "${d.fromTeamName}" to "${team.name}"?`,
    );
    if (!confirmed) return;

    setError(null);
    setBusy(true);
    const res = await transferRegistration(d.registrationId, team.name);
    setBusy(false);
    if (res.ok) router.refresh();
    else setError(res.error);
  };

  return (
    <>
      <p className="mb-4 text-sm text-white/70">
        Drag a member onto another team to move them.
      </p>
      {error && (
        <p role="alert" className="mb-4 text-sm font-semibold text-destructive">
          {error}
        </p>
      )}

      <div
        className={cn(
          "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3",
          busy && "pointer-events-none opacity-60",
        )}
      >
        {teams.map((team) => {
          const isTarget = overTeamId === team.id && dragged?.fromTeamId !== team.id;
          return (
            <section
              key={team.id}
              onDragOver={(e) => {
                e.preventDefault();
                if (overTeamId !== team.id) setOverTeamId(team.id);
              }}
              onDragLeave={() =>
                setOverTeamId((id) => (id === team.id ? null : id))
              }
              onDrop={() => handleDrop(team)}
              className={cn(
                "flex flex-col rounded-xl border bg-card p-4 shadow-sm transition-colors",
                isTarget ? "border-primary ring-2 ring-primary/40" : "border-border",
              )}
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
                    draggable
                    onDragStart={() =>
                      setDragged({
                        registrationId: m.registration_id,
                        memberName: m.full_name,
                        fromTeamId: team.id,
                        fromTeamName: team.name,
                      })
                    }
                    onDragEnd={() => {
                      setDragged(null);
                      setOverTeamId(null);
                    }}
                    className="flex cursor-grab items-center justify-between gap-2 py-2 active:cursor-grabbing"
                  >
                    <div className="flex min-w-0 items-center gap-1.5">
                      <GripVertical className="size-4 shrink-0 text-muted-foreground/60" />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">{m.full_name}</p>
                        <p className="truncate text-xs text-muted-foreground">
                          {m.email}
                        </p>
                      </div>
                    </div>
                    <StatusBadge status={m.status} />
                  </li>
                ))}
              </ul>

              <TeamActions teamId={team.id} />
            </section>
          );
        })}
      </div>
    </>
  );
}
