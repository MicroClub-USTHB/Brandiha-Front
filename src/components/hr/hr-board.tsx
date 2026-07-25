"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, GripVertical, Info } from "lucide-react";
import {
  setRegistrationStatus,
  transferRegistration,
} from "@/lib/api/registrations";
import type { Team } from "@/lib/api/team-types";
import type { RegistrationStatus } from "@/lib/api/registration-types";
import { StatusBadge } from "@/components/hr/status-badge";
import { TeamActions } from "@/components/hr/team-actions";
import { MemberDetail } from "@/components/hr/member-detail";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { cn } from "@/lib/utils";

type Dragged = {
  registrationId: string;
  memberName: string;
  fromTeamId: string;
  fromTeamName: string;
};

/**
 * A team's status is the majority of its members' statuses. Ties (no clear
 * majority, including an empty team) resolve to `pending`. This replaces the
 * backend's arbitrary single-member value.
 */
function teamStatus(members: Team["members"]): RegistrationStatus {
  const counts: Record<RegistrationStatus, number> = {
    pending: 0,
    accepted: 0,
    rejected: 0,
  };
  for (const m of members) counts[m.status]++;

  const max = Math.max(counts.pending, counts.accepted, counts.rejected);
  const leaders = (["accepted", "rejected", "pending"] as const).filter(
    (s) => counts[s] === max,
  );
  return leaders.length === 1 ? leaders[0] : "pending";
}

/** HR board: cards per team with drag-and-drop to move a member between teams. */
export function HrBoard({ teams }: { teams: Team[] }) {
  const router = useRouter();
  const [dragged, setDragged] = useState<Dragged | null>(null);
  const [overTeamId, setOverTeamId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [pending, setPending] = useState<{ member: Dragged; team: Team } | null>(
    null,
  );
  const [detailId, setDetailId] = useState<string | null>(null);

  // A drop stages the move and opens the confirmation dialog; the transfer runs
  // from `confirmMove` once the user accepts.
  const handleDrop = (team: Team) => {
    setOverTeamId(null);
    const d = dragged;
    setDragged(null);
    // Nothing to do when dropped back onto the member's own team.
    if (!d || d.fromTeamId === team.id) return;
    setPending({ member: d, team });
  };

  const confirmMove = async () => {
    if (!pending) return;
    const { member: d, team } = pending;
    const targetStatus = teamStatus(team.members);
    setPending(null);

    setError(null);
    setBusy(true);
    const moved = await transferRegistration(d.registrationId, team.name);
    if (!moved.ok) {
      setBusy(false);
      setError(moved.error);
      return;
    }
    // The member's status follows the team (majority) they landed in.
    const synced = await setRegistrationStatus(d.registrationId, targetStatus);
    setBusy(false);
    if (synced.ok) router.refresh();
    else setError(synced.error);
  };

  return (
    <>
      <div className="mb-6 flex items-start gap-3 rounded-xl border border-white/20 bg-white/30 p-4">
        <Info className="mt-0.5 size-5 shrink-0 text-white" />
        <div>
          <h2 className="text-sm font-semibold text-white">
            Move members between teams
          </h2>
          <p className="text-sm text-white/70">
            Drag a member onto another team to move them.
          </p>
        </div>
      </div>
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
                <StatusBadge status={teamStatus(team.members)} />
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
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => setDetailId(m.registration_id)}
                      aria-label={`View ${m.full_name}`}
                      className="shrink-0 cursor-pointer text-muted-foreground"
                    >
                      <Eye className="size-4" />
                    </Button>
                  </li>
                ))}
              </ul>

              <TeamActions teamId={team.id} teamName={team.name} />
            </section>
          );
        })}
      </div>

      <AlertDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (!open) setPending(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Move member?</AlertDialogTitle>
            <AlertDialogDescription>
              {pending && (
                <>
                  Move{" "}
                  <span className="font-semibold text-foreground">
                    {pending.member.memberName}
                  </span>{" "}
                  from &ldquo;{pending.member.fromTeamName}&rdquo; to &ldquo;
                  {pending.team.name}&rdquo;? They&rsquo;ll be marked &ldquo;
                  {teamStatus(pending.team.members)}&rdquo; to match the team.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmMove}>Move</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MemberDetail
        registrationId={detailId}
        onClose={() => setDetailId(null)}
      />
    </>
  );
}
