"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Reorder } from "motion/react";
import { CircleCheckBig, Send } from "lucide-react";
import { submitVote } from "@/lib/api/voting";
import type { Team } from "@/lib/api/team-types";
import { BallotRow } from "@/components/vote/ballot-row";
import { ActionButton } from "@/components/action-button";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

/**
 * The ballot: every accepted team in one reorderable list, submitted as a Borda
 * ranking (1st preference first).
 *
 * The list is client-owned while it's being ranked — seeded from the server,
 * reordered locally — and only leaves for the backend on submit. One vote each:
 * once a ranking is on record the list locks, matching the backend, which
 * answers a second `POST /alumni/voting` with `409`. A returning voter gets
 * their teams back in their own submitted order, read-only.
 */
export function VoteBallot({
  initialTeams,
  hasVoted,
}: {
  initialTeams: Team[];
  hasVoted: boolean;
}) {
  const router = useRouter();
  const [order, setOrder] = useState<Team[]>(initialTeams);
  /** Whether a vote is on record — from the server, or cast in this session. */
  const [voted, setVoted] = useState(hasVoted);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  /** Move the team at 1-based rank `from` to rank `to`, sliding the rest along. */
  const move = (from: number, to: number) => {
    setOrder((prev) => {
      const next = [...prev];
      const [team] = next.splice(from - 1, 1);
      next.splice(to - 1, 0, team);
      return next;
    });
  };

  const handleSubmit = async () => {
    setError(null);
    setBusy(true);
    const result = await submitVote(order.map((t) => t.id));
    setBusy(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setVoted(true);
    // Re-run the page so a later visit reads the ranking back from the backend
    // rather than this component's memory of it.
    router.refresh();
  };

  return (
    <div className="mt-8 w-full max-w-4xl">
      <Reorder.Group
        axis="y"
        values={order}
        onReorder={setOrder}
        className="flex w-full flex-col gap-3"
      >
        {order.map((team, i) => (
          <BallotRow
            key={team.id}
            team={team}
            rank={i + 1}
            total={order.length}
            disabled={busy}
            readOnly={voted}
            onMove={(to) => move(i + 1, to)}
          />
        ))}
      </Reorder.Group>

      {error && (
        <p role="alert" className="mt-6 text-center text-sm font-semibold text-destructive">
          {error}
        </p>
      )}

      <div className={cn("mt-8 flex w-full", !voted && "justify-center")}>
        {voted ? (
          <p role="status" className="flex items-center gap-2 text-sm text-white/70">
            <CircleCheckBig className="size-4 text-primary" aria-hidden />
            Vote recorded. Your ranking is final and can&apos;t be changed.
          </p>
        ) : (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <ActionButton
                variant="primary"
                type="button"
                disabled={busy}
                className="h-12 w-full max-w-xs"
              >
                Submit vote
                <Send className="size-4 stroke-[2.5]" />
              </ActionButton>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Submit your vote?</AlertDialogTitle>
                <AlertDialogDescription>
                  You get one vote, and this ranking is final once it&rsquo;s in.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Keep ranking</AlertDialogCancel>
                <AlertDialogAction onClick={handleSubmit}>
                  Submit vote
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>
    </div>
  );
}
