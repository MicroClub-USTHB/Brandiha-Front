import { Check, RotateCcw, X, type LucideIcon } from "lucide-react";

import type { RegistrationStatus } from "@/lib/api/registration-types";

/**
 * Everything the HR board says about a status, in one place: its name, the
 * verb that moves a team to it, and the colours each surface paints it with —
 * so renaming or recolouring a status is one edit, not three files.
 */
export const STATUS_META: Record<
  RegistrationStatus,
  {
    label: string;
    /** The team action that sets this status. */
    verb: string;
    icon: LucideIcon;
    /** `StatusBadge` pill. */
    badge: string;
    /** `TeamStatsBar` card while its filter is on. */
    card: string;
    /** `TeamActions` button. */
    action: string;
  }
> = {
  pending: {
    label: "Pending",
    verb: "Reset",
    icon: RotateCcw,
    badge: "bg-warning/15 text-warning",
    card: "bg-warning text-warning-foreground ring-warning/50",
    action: "bg-muted text-muted-foreground hover:bg-muted/70",
  },
  accepted: {
    label: "Accepted",
    verb: "Accept",
    icon: Check,
    badge: "bg-success/15 text-success",
    card: "bg-success text-success-foreground ring-success/50",
    action: "bg-success/10 text-success hover:bg-success/20",
  },
  rejected: {
    label: "Rejected",
    verb: "Decline",
    icon: X,
    badge: "bg-destructive/15 text-destructive",
    card: "bg-destructive text-destructive-foreground ring-destructive/50",
    action: "bg-destructive/10 text-destructive hover:bg-destructive/20",
  },
};
