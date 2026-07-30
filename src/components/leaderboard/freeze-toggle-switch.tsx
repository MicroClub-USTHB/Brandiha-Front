"use client";

import { useState } from "react";
import { toggleLeaderboardFreezeAction } from "@/lib/api/freezeAction";
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
  const [pendingFrozen, setPendingFrozen] = useState<boolean | null>(null);

  const handleToggle = async () => {
    if (pendingFrozen === null) return;
    setLoading(true);

    const res = await toggleLeaderboardFreezeAction();
    setLoading(false);

    if (res.success && typeof res.frozen === "boolean") {
      setFrozen(res.frozen);
      setPendingFrozen(null);
      setOpen(false);
    } else {
      alert(res.error || "Une erreur est survenue lors de la modification.");
    }
  };

  const requestToggle = (nextFrozen: boolean) => {
    if (loading) return;
    setPendingFrozen(nextFrozen);
    setOpen(true);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
        <AlertDialogTrigger asChild>
          <Switch
            id="freeze-mode"
            checked={frozen}
            onCheckedChange={(checked) => requestToggle(checked)}
            disabled={loading}
          />
        </AlertDialogTrigger>
        <Label
          htmlFor="freeze-mode"
          className="flex cursor-pointer items-center gap-2 text-sm font-medium"
        >
          <span className="font-heading">{frozen ? "frozen" : "unfrozen"}</span>
          {loading && <span className="text-xs text-muted-foreground">(Updating...)</span>}
        </Label>
      </div>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {pendingFrozen ? "Freeze the leaderboard?" : "Unfreeze the leaderboard?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {pendingFrozen
              ? "This will lock leaderboard updates until you unfreeze it again."
              : "This will allow leaderboard updates again."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setPendingFrozen(null);
            }}
          >
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleToggle}>Save changes</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}