import { STATUS_META } from "@/components/hr/status-meta";
import type { RegistrationStatus } from "@/lib/api/registration-types";
import { cn } from "@/lib/utils";

/** Small pill showing a registration/team status. Presentational (no hooks). */
export function StatusBadge({ status }: { status: RegistrationStatus }) {
  return (
    <span
      className={cn(
        "shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold capitalize",
        STATUS_META[status].badge,
      )}
    >
      {status}
    </span>
  );
}
