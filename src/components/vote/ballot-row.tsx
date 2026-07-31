"use client";

import { Reorder, useDragControls } from "motion/react";
import { ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Team } from "@/lib/api/team-types";
import { cn } from "@/lib/utils";

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
      className="flex items-center gap-4 rounded-xl px-6 py-5 lg:px-8 lg:py-6"
      style={{
        backgroundImage: "url('/paper.svg')",
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
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
          <GripVertical className="size-5 lg:size-6" />
        </button>
      )}

      <span
        aria-hidden
        className="w-8 shrink-0 text-center font-heading text-lg font-bold text-primary lg:text-xl"
      >
        {rank}
      </span>

      <div className="min-w-0 flex-1">
        <p className="truncate font-heading text-xl font-bold capitalize lg:text-2xl">
          {team.name}
        </p>
        <p className="truncate text-sm text-muted-foreground lg:text-base">
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
            <ChevronUp className="size-5 lg:size-6" />
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
            <ChevronDown className="size-5 lg:size-6" />
          </Button>
        </div>
      )}
    </Reorder.Item>
  );
}
