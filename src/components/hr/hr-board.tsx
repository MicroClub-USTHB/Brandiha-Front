"use client";

import { useRef, useState } from "react";
import { Info } from "lucide-react";
import {
  setRegistrationStatus,
  transferRegistration,
} from "@/lib/api/registrations";
import { listTeams } from "@/lib/api/teams";
import type { Team, TeamMember } from "@/lib/api/team-types";
import type { RegistrationStatus } from "@/lib/api/registration-types";
import { StatusBadge } from "@/components/hr/status-badge";
import { TeamActions } from "@/components/hr/team-actions";
import { MemberDetail } from "@/components/hr/member-detail";
import { MemberRow, type Point } from "@/components/hr/member-row";
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

/**
 * A team's status is the majority of its members' statuses. Ties (no clear
 * majority, including an empty team) resolve to `pending`. Replaces the
 * backend's arbitrary single-member value.
 */
function teamStatus(members: TeamMember[]): RegistrationStatus {
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

type PendingMove = { member: TeamMember; fromTeam: Team; toTeam: Team };

/** Apply a staged move to the board so the member shows in the target team. */
function withMove(board: Team[], move: PendingMove): Team[] {
  return board.map((t) => {
    if (t.id === move.toTeam.id)
      return { ...t, members: [...t.members, move.member] };
    if (t.id === move.fromTeam.id)
      return {
        ...t,
        members: t.members.filter(
          (m) => m.registration_id !== move.member.registration_id,
        ),
      };
    return t;
  });
}

/** HR board: cards per team with drag-and-drop to move a member between teams. */
export function HrBoard({ teams }: { teams: Team[] }) {
  // Client-owned board; seeded from the server, then refreshed via `listTeams`.
  const [board, setBoard] = useState<Team[]>(teams);
  const [pending, setPending] = useState<PendingMove | null>(null);
  const [dragging, setDragging] = useState<{ fromTeamId: string } | null>(null);
  const [hoverTeamId, setHoverTeamId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  // Set while confirming so the dialog's close handler doesn't revert the move.
  const confirmingRef = useRef(false);

  const cardEls = useState(() => new Map<string, HTMLElement>())[0];

  const teamAtPoint = (point: Point): Team | null => {
    for (const t of board) {
      const el = cardEls.get(t.id);
      if (!el) continue;
      const r = el.getBoundingClientRect();
      if (
        point.x >= r.left &&
        point.x <= r.right &&
        point.y >= r.top &&
        point.y <= r.bottom
      ) {
        return t;
      }
    }
    return null;
  };

  const handleDragStart = (_member: TeamMember, fromTeam: Team) =>
    setDragging({ fromTeamId: fromTeam.id });

  const handleDragOver = (point: Point) => {
    const id = teamAtPoint(point)?.id ?? null;
    setHoverTeamId((prev) => (prev === id ? prev : id));
  };

  const handleDragEnd = (member: TeamMember, fromTeam: Team, point: Point) => {
    const target = teamAtPoint(point);
    setDragging(null);
    setHoverTeamId(null);
    if (!target || target.id === fromTeam.id) return;
    setPending({ member, fromTeam, toTeam: target });
  };

  const refreshBoard = async () => {
    const res = await listTeams();
    if (res.ok) setBoard(res.data);
  };

  const confirmMove = async () => {
    if (!pending) return;
    const move = pending;
    const { member, toTeam } = move;
    const targetStatus = teamStatus(toTeam.members);

    setError(null);
    setBusy(true);
    const moved = await transferRegistration(member.registration_id, toTeam.name);
    if (!moved.ok) {
      setPending(null);
      setBusy(false);
      setError(moved.error);
      return;
    }
    // The member's status follows the team (majority) they landed in.
    const synced = await setRegistrationStatus(member.registration_id, targetStatus);

    // Commit the move into the board locally — the optimistic overlay already
    // shows it, so no refetch (which would reshuffle the unstable backend order).
    const committed = { ...move, member: { ...member, status: targetStatus } };
    setBoard((b) => withMove(b, committed));
    setPending(null);
    setBusy(false);
    if (!synced.ok) setError(synced.error);
  };

  const view = pending ? withMove(board, pending) : board;

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
          busy && "pointer-events-none",
        )}
      >
        {view.map((team) => {
          const isTarget =
            !!dragging &&
            hoverTeamId === team.id &&
            dragging.fromTeamId !== team.id;
          return (
            <section
              key={team.id}
              ref={(el) => {
                if (el) cardEls.set(team.id, el);
                else cardEls.delete(team.id);
              }}
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
                  <MemberRow
                    key={m.registration_id}
                    member={m}
                    team={team}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDragEnd={handleDragEnd}
                    onView={setDetailId}
                  />
                ))}
                {isTarget && (
                  <li className="mt-2 h-11 rounded-md border-2 border-dashed border-primary/50" />
                )}
              </ul>

              <TeamActions
                teamId={team.id}
                teamName={team.name}
                onDone={refreshBoard}
              />
            </section>
          );
        })}
      </div>

      <AlertDialog
        open={pending !== null}
        onOpenChange={(open) => {
          if (open) return;
          // Confirming also closes the dialog — don't revert in that case;
          // confirmMove keeps the overlay until it commits the move.
          if (confirmingRef.current) {
            confirmingRef.current = false;
            return;
          }
          setPending(null);
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
                    {pending.member.full_name}
                  </span>{" "}
                  from &ldquo;{pending.fromTeam.name}&rdquo; to &ldquo;
                  {pending.toTeam.name}&rdquo;? They&rsquo;ll be marked &ldquo;
                  {teamStatus(pending.toTeam.members)}&rdquo; to match the team.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                confirmingRef.current = true;
                confirmMove();
              }}
            >
              Move
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <MemberDetail registrationId={detailId} onClose={() => setDetailId(null)} />
    </>
  );
}
