"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteTeam, updateTeamStatus } from "@/lib/api/teams";
import type { ActionResult } from "@/lib/api/result";
import type { RegistrationStatus } from "@/lib/api/registration-types";
import type { TeamMember } from "@/lib/api/team-types";
import { canDeleteTeam } from "@/lib/team-status";
import { STATUS_META } from "@/components/hr/status-meta";
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

/** Button order in the footer. */
const ACTIONS: RegistrationStatus[] = ["rejected", "pending", "accepted"];

const BTN_BASE =
  "flex flex-1 items-center justify-center gap-1 rounded-md px-2 py-1.5 text-xs font-semibold transition-colors disabled:pointer-events-none disabled:opacity-50";

/** Decline / Reset / Accept footer that bulk-sets a team's member statuses. */
export function TeamActions({
  teamId,
  teamName,
  currentStatus,
  members,
  onDone,
}: {
  teamId: string;
  teamName: string;
  currentStatus: RegistrationStatus;
  /** The team's members, to decide whether a delete is even permitted. */
  members: TeamMember[];
  onDone: () => void | Promise<void>;
}) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<RegistrationStatus | null>(null);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const canDelete = canDeleteTeam(members);

  /** Close both dialogs, run `action`, then refresh the board or show why not. */
  const perform = (action: () => Promise<ActionResult>) => {
    setConfirming(null);
    setConfirmingDelete(false);
    setError(null);
    startTransition(async () => {
      const res = await action();
      if (res.ok) await onDone();
      else setError(res.error);
    });
  };

  return (
    <div className="mt-3 border-t border-border pt-3">
      <div className="flex gap-2">
        {ACTIONS.map((status) => {
          const { verb, icon: Icon, action } = STATUS_META[status];
          return (
            <button
              key={status}
              type="button"
              onClick={() => setConfirming(status)}
              disabled={pending || currentStatus === status}
              className={cn(BTN_BASE, action)}
            >
              <Icon className="size-3.5 stroke-[2.5]" />
              {verb}
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() => setConfirmingDelete(true)}
        disabled={pending || !canDelete}
        title={
          canDelete
            ? undefined
            : "A team can only be deleted once every member is rejected"
        }
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
            <AlertDialogAction variant="destructive" onClick={() => perform(() => deleteTeam(teamId))}>
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
              {confirming ? `${STATUS_META[confirming].verb} team?` : ""}
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
            <AlertDialogAction onClick={() => confirming && perform(() => updateTeamStatus(teamId, confirming))}>
              Confirm
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
