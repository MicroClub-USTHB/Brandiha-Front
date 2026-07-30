import { Loader2 } from "lucide-react";

/**
 * Shown while a dashboard page resolves. These are the routes that actually
 * wait on something: every one of them is dynamic and fetches from the backend
 * before it can render a table or a ballot.
 *
 * Scoped to `(dashboard)` rather than the app root on purpose — the landing and
 * registration pages are prerendered, so a root-level loading state would only
 * add a flash of spinner to navigations that were already instant.
 *
 * It sits inside the dashboard layout, so the header stays put and only the
 * page area swaps.
 */
export default function DashboardLoading() {
  return (
    <div
      role="status"
      className="flex flex-1 flex-col items-center justify-center gap-3 p-6 font-sans"
    >
      <Loader2 className="size-6 animate-spin text-white/60" aria-hidden />
      <p className="text-sm text-white/60">Loading…</p>
    </div>
  );
}
