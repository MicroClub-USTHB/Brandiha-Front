"use client";
import type { RegistrationStatus } from "@/lib/api/registration-types";
import { cn } from "@/lib/utils";

type CardDef = {
  key: RegistrationStatus;
  label: string;
  bg: string;
  ring: string;
};

const CARDS: CardDef[] = [
  {
    key: "pending",
    label: "Pending",
    bg: "bg-warning text-warning-foreground",
    ring: "ring-warning/50",
  },
  {
    key: "accepted",
    label: "Accepted",
    bg: "bg-success text-success-foreground",
    ring: "ring-success/50",
  },
  {
    key: "rejected",
    label: "Rejected",
    bg: "bg-destructive text-white",
    ring: "ring-destructive/50",
  },
];

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

      {CARDS.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={() => onFilterChange(filter === c.key ? null : c.key)}
          className={cn(
            "cursor-pointer flex flex-col justify-center rounded-xl p-5 shadow-sm transition-all hover:shadow-md text-left",
            filter === c.key
              ? cn(c.bg, "ring-2", c.ring)
              : "bg-white/15 text-white/60 hover:bg-white/20 hover:text-white/80",
          )}
        >
          <span className="text-3xl font-black tracking-tight">
            {counts[c.key]}
          </span>
          <span className="mt-0.5 text-xs font-bold uppercase tracking-widest">
            {c.label}
          </span>
        </button>
      ))}
    </div>
  );
}
