"use client";

import { useState } from "react";
import { Snowflake } from "lucide-react";
import { toggleLeaderboardFreeze } from "@/lib/api/leaderboard";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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

interface FreezeToggleSwitchProps {
  initialFrozen: boolean;
}

export function FreezeToggleSwitch({ initialFrozen }: FreezeToggleSwitchProps) {
  const [frozen, setFrozen] = useState(initialFrozen);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleToggle = async () => {
    setLoading(true);
    const res = await toggleLeaderboardFreeze();
    setLoading(false);

    setOpen(false);
    if (res.ok) setFrozen(res.data.frozen);
    else setError(res.error);
  };

  // The switch is only a trigger: flipping it opens the confirmation, and the
  // toggle happens on "Save changes". It's disabled while a toggle is running.
  const handleOpenChange = (next: boolean) => {
    if (next) setError(null);
    setOpen(next);
  };

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <div className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-black p-3 shadow-sm text-white">
        <AlertDialogTrigger asChild>
          <Switch
            id="freeze-mode"
            checked={frozen}
            disabled={loading}
            className="data-[state=checked]:bg-white data-[state=unchecked]:bg-neutral-800 border border-neutral-700"
          />
        </AlertDialogTrigger>
        <Label
          htmlFor="freeze-mode"
          className="flex cursor-pointer items-center gap-2 text-sm font-medium text-white"
        >
          {frozen && <Snowflake className="size-4 text-white" />}
          <span className="font-heading">{frozen ? "frozen" : "unfrozen"}</span>
          {loading && <span className="text-xs text-neutral-400">(Updating...)</span>}
        </Label>
      </div>
      {error && (
        <p role="alert" className="text-sm font-semibold text-destructive">
          {error}
        </p>
      )}

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {frozen ? "Unfreeze the leaderboard?" : "Freeze the leaderboard?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {frozen
              ? "This will allow leaderboard updates again."
              : "This will lock leaderboard updates until you unfreeze it again."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleToggle}>Save changes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}