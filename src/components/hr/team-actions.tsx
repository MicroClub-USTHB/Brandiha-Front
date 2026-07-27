"use client";

import { useState, useTransition } from "react";
import { Check, RotateCcw, Trash2, X } from "lucide-react";
import { deleteTeam, updateTeamStatus } from "@/lib/api/teams";
import type { RegistrationStatus } from "@/lib/api/registration-types";
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

const BTN_BASE =
  "flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50";

/** Verb shown for each target status. */
const VERB: Record<RegistrationStatus, string> = {
  rejected: "Decline",
  pending: "Reset",
  accepted: "Accept",
};

/** Decline / Reset / Accept footer that bulk-sets a team's member statuses. */
export function TeamActions({
  teamId,
  teamName,
  currentStatus,
  memberCount,
  onDone,
}: {
  teamId: string;
  teamName: string;
  currentStatus: RegistrationStatus;
  memberCount: number;
  onDone: () => void | Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<RegistrationStatus | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  // A team can be deleted if it has no members or if it's been rejected.
  const canDelete = memberCount === 0 || currentStatus === "rejected";

  const run = (status: RegistrationStatus) => {
    setConfirming(null);
    setError(null);
    startTransition(async () => {
      const res = await updateTeamStatus(teamId, status);
      if (res.ok) await onDone();
      else setError(res.error);
    });
  };

  const runDelete = () => {
    setConfirmingDelete(false);
    setError(null);
    startTransition(async () => {
      const res = await deleteTeam(teamId);
      if (res.ok) await onDone();
      else setError(res.error);
    });
  };

  return (
    <div className="mt-3 border-t border-border pt-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setConfirming("rejected")}
          disabled={pending || currentStatus === "rejected"}
          className={cn(BTN_BASE, "bg-red-500/10 text-red-700 hover:bg-red-500/20")}
        >
          <X className="size-3.5 stroke-[2.5]" />
          Decline
        </button>
        <button
          type="button"
          onClick={() => setConfirming("pending")}
          disabled={pending || currentStatus === "pending"}
          className={cn(BTN_BASE, "bg-muted text-muted-foreground hover:bg-muted/70")}
        >
          <RotateCcw className="size-3.5 stroke-[2.5]" />
          Reset
        </button>
        <button
          type="button"
          onClick={() => setConfirming("accepted")}
          disabled={pending || currentStatus === "accepted"}
          className={cn(BTN_BASE, "bg-green-500/10 text-green-700 hover:bg-green-500/20")}
        >
          <Check className="size-3.5 stroke-[2.5]" />
          Accept
        </button>
      </div>

      <button
        type="button"
        onClick={() => setConfirmingDelete(true)}
        disabled={pending || !canDelete}
        title={canDelete ? undefined : "Only empty or rejected teams can be deleted"}
        className={cn(
          BTN_BASE,
          "mt-2 w-full bg-destructive/10 text-destructive hover:bg-destructive/20",
        )}
      >
        <Trash2 className="size-3.5 stroke-[2.5]" />
        Delete team
      </button>

      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

      <AlertDialog
        open={confirmingDelete}
        onOpenChange={(open) => {
          if (!open) setConfirmingDelete(false);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete team?</AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes &ldquo;{teamName}&rdquo;. This action
              can&rsquo;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={runDelete}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={confirming !== null}
        onOpenChange={(open) => {
          if (!open) setConfirming(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirming ? `${VERB[confirming]} team?` : ""}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirming && (
                <>
                  This sets{" "}
                  <span className="font-semibold text-foreground">all members</span>{" "}
                  of &ldquo;{teamName}&rdquo; to &ldquo;{confirming}&rdquo;.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={() => confirming && run(confirming)}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
