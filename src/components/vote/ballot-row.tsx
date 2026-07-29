"use client";

import { Reorder, useDragControls } from "motion/react";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Team } from "@/lib/api/team-types";
import { cn } from "@/lib/utils";

/**
 * One team on the ballot, as a `Reorder.Item` inside the ballot's group. Drag
 * starts from the grip only (`dragListener={false}` + `dragControls`, following
 * `hr/member-row.tsx`) so the arrow buttons stay clickable, and `Reorder` swaps
 * the neighbours as the row passes them.
 *
 * The arrows are not a nicety: dragging is pointer-only, and they're the whole
 * of the keyboard and screen-reader path through the ranking.
 *
 * `readOnly` drops both — a submitted vote can't be changed, so the row shows
 * the ranking without offering a way to move it. `disabled` is the transient
 * version of that, held while a submit is in flight.
 */
export function BallotRow({
  team,
  rank,
  total,
  disabled,
  readOnly,
  onMove,
}: {
  team: Team;
  rank: number;
  total: number;
  disabled: boolean;
  readOnly: boolean;
  /** Move this team to `to` (a 1-based rank), reordering the ballot around it. */
  onMove: (to: number) => void;
}) {
  const controls = useDragControls();
  const frozen = readOnly || disabled;

  return (
    <Reorder.Item
      value={team}
      drag={frozen ? false : "y"}
      dragListener={false}
      dragControls={controls}
      whileDrag={{
        scale: 1.02,
        zIndex: 50,
        cursor: "grabbing",
        boxShadow: "0 12px 28px rgba(0, 0, 0, 0.25)",
      }}
      className="flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-card-foreground"
    >
      {!readOnly && (
        <button
          type="button"
          aria-label={`Drag ${team.name} to reorder`}
          disabled={disabled}
          onPointerDown={(e) => controls.start(e)}
          className={cn(
            "shrink-0 touch-none text-muted-foreground/60",
            disabled ? "opacity-40" : "cursor-grab active:cursor-grabbing",
          )}
        >
          <GripVertical className="size-4" />
        </button>
      )}

      <span
        aria-hidden
        className="w-7 shrink-0 text-center font-mono text-sm font-bold text-primary"
      >
        {rank}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold capitalize">{team.name}</p>
        <p className="truncate text-xs text-muted-foreground">
          {team.members.length === 1 ? "1 member" : `${team.members.length} members`}
          {team.members.length > 0 && (
            <> &middot; {team.members.map((m) => m.full_name).join(", ")}</>
          )}
        </p>
      </div>

      {!readOnly && (
        <div className="flex shrink-0 items-center">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={disabled || rank === 1}
            onClick={() => onMove(rank - 1)}
            aria-label={`Move ${team.name} up to rank ${rank - 1}`}
            className="cursor-pointer text-muted-foreground"
          >
            <ChevronUp className="size-4" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={disabled || rank === total}
            onClick={() => onMove(rank + 1)}
            aria-label={`Move ${team.name} down to rank ${rank + 1}`}
            className="cursor-pointer text-muted-foreground"
          >
            <ChevronDown className="size-4" />
          </Button>
        </div>
      )}
    </Reorder.Item>
  );
}
