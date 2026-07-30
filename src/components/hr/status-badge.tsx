const STATUS_STYLES: Record<string, string> = {
  accepted: "bg-success/15 text-success",
  rejected: "bg-destructive/15 text-destructive",
  pending: "bg-warning/15 text-warning",
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
