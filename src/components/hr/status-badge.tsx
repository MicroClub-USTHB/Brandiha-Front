const STATUS_STYLES: Record<string, string> = {
  accepted: "bg-green-500/15 text-green-700",
  rejected: "bg-red-500/15 text-red-700",
  pending: "bg-yellow-500/15 text-yellow-700",
};

/** Small pill showing a registration/team status. Presentational (no hooks). */
export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[status] ?? "bg-muted text-muted-foreground"}`}
    >
      {status}
    </span>
  );
}
