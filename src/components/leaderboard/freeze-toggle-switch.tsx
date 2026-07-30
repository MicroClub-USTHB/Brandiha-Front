"use client";

import { useState } from "react";
import { toggleLeaderboardFreezeAction } from "@/lib/api/freezeAction";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface FreezeToggleSwitchProps {
  initialFrozen: boolean;
}

export function FreezeToggleSwitch({ initialFrozen }: FreezeToggleSwitchProps) {
  const [frozen, setFrozen] = useState(initialFrozen);
  const [loading, setLoading] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setLoading(true);

    const res = await toggleLeaderboardFreezeAction();
    setLoading(false);

    if (res.success && typeof res.frozen === "boolean") {
      setFrozen(res.frozen);
    } else {
      alert(res.error || "Une erreur est survenue lors de la modification.");
    }
  };

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 shadow-sm">
      <Switch
        id="freeze-mode"
        checked={frozen}
        onCheckedChange={handleToggle}
        disabled={loading}
      />
      <Label
        htmlFor="freeze-mode"
        className="cursor-pointer font-medium text-sm flex items-center gap-2"
      >
        <span className="font-heading">{frozen ? "frozen" : "unfrozen"}</span>
        {loading && <span className="text-xs text-muted-foreground">(Mise à jour...)</span>}
      </Label>
    </div>
  );
}