"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check, RotateCcw, X } from "lucide-react";
import { updateTeamStatus } from "@/lib/api/teams";
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
}: {
  teamId: string;
  teamName: string;
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState<RegistrationStatus | null>(null);

  const run = (status: RegistrationStatus) => {
    setConfirming(null);
    setError(null);
    startTransition(async () => {
      const res = await updateTeamStatus(teamId, status);
      if (res.ok) router.refresh();
      else setError(res.error);
    });
  };

  return (
    <div className="mt-3 border-t border-border pt-3">
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setConfirming("rejected")}
          disabled={pending}
          className={cn(BTN_BASE, "bg-red-500/10 text-red-700 hover:bg-red-500/20")}
        >
          <X className="size-3.5 stroke-[2.5]" />
          Decline
        </button>
        <button
          type="button"
          onClick={() => setConfirming("pending")}
          disabled={pending}
          className={cn(BTN_BASE, "bg-muted text-muted-foreground hover:bg-muted/70")}
        >
          <RotateCcw className="size-3.5 stroke-[2.5]" />
          Reset
        </button>
        <button
          type="button"
          onClick={() => setConfirming("accepted")}
          disabled={pending}
          className={cn(BTN_BASE, "bg-green-500/10 text-green-700 hover:bg-green-500/20")}
        >
          <Check className="size-3.5 stroke-[2.5]" />
          Accept
        </button>
      </div>
      {error && <p className="mt-2 text-xs text-destructive">{error}</p>}

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
