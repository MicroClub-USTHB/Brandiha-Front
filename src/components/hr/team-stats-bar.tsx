"use client";
import { STATUS_META } from "@/components/hr/status-meta";
import type { RegistrationStatus } from "@/lib/api/registration-types";
import { cn } from "@/lib/utils";

/** Card order, left to right after "All teams". */
const CARDS: RegistrationStatus[] = ["pending", "accepted", "rejected"];

export function TeamStatsBar({
  total,
  counts,
  filter,
  onFilterChange,
}: {
  total: number;
  /** Teams per status, as `countTeamsByStatus` reads them. */
  counts: Record<RegistrationStatus, number>;
  filter: RegistrationStatus | null;
  onFilterChange: (s: RegistrationStatus | null) => void;
}) {

  return (
    <div className="mb-6 grid grid-cols-4 gap-4">
      <button
        type="button"
        onClick={() => onFilterChange(null)}
        className={cn(
          "cursor-pointer flex flex-col justify-center rounded-xl p-5 shadow-sm transition-all hover:shadow-md text-left",
          !filter
            ? "bg-white/25 text-white ring-2 ring-white/50"
            : "bg-white/15 text-white/60 hover:bg-white/20 hover:text-white/80",
        )}
      >
        <span className="text-3xl font-black tracking-tight">{total}</span>
        <span className="mt-0.5 text-xs font-bold uppercase tracking-widest">
          All teams
        </span>
      </button>

      {CARDS.map((status) => (
        <button
          key={status}
          type="button"
          onClick={() => onFilterChange(filter === status ? null : status)}
          className={cn(
            "cursor-pointer flex flex-col justify-center rounded-xl p-5 shadow-sm transition-all hover:shadow-md text-left",
            filter === status
              ? cn(STATUS_META[status].cardClass, "ring-2")
              : "bg-white/15 text-white/60 hover:bg-white/20 hover:text-white/80",
          )}
        >
          <span className="text-3xl font-black tracking-tight">
            {counts[status]}
          </span>
          <span className="mt-0.5 text-xs font-bold uppercase tracking-widest">
            {STATUS_META[status].label}
          </span>
        </button>
      ))}
    </div>
  );
}
