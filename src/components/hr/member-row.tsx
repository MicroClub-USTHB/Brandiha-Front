"use client";

import { motion, useDragControls, type PanInfo } from "motion/react";
import { Eye, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Team, TeamMember } from "@/lib/api/team-types";

export type Point = { x: number; y: number };

function pointFromEvent(
  event: MouseEvent | TouchEvent | PointerEvent,
  info: PanInfo,
): Point {
  if ("clientX" in event) return { x: event.clientX, y: event.clientY };
  const touch = event.changedTouches?.[0];
  return touch ? { x: touch.clientX, y: touch.clientY } : info.point;
}

/**
 * A draggable member row (Framer Motion). Drag only starts from the grip handle
 * (`dragListener={false}` + `dragControls`); the whole row follows the cursor.
 * `layout`/`layoutId` animate the row when it moves between team lists.
 */
export function MemberRow({
  member,
  team,
  onDragStart,
  onDragOver,
  onDragEnd,
  onView,
}: {
  member: TeamMember;
  team: Team;
  onDragStart: (member: TeamMember, fromTeam: Team) => void;
  onDragOver: (point: Point) => void;
  onDragEnd: (member: TeamMember, fromTeam: Team, point: Point) => void;
  onView: (registrationId: string) => void;
}) {
  const controls = useDragControls();

  return (
    <motion.li
      layout
      layoutId={member.registration_id}
      drag
      dragListener={false}
      dragControls={controls}
      dragSnapToOrigin
      whileDrag={{
        scale: 1.03,
        zIndex: 50,
        cursor: "grabbing",
        borderRadius: 8,
        boxShadow: "0 12px 28px rgba(0, 0, 0, 0.25)",
      }}
      onDragStart={() => onDragStart(member, team)}
      onDrag={(event, info) => onDragOver(pointFromEvent(event, info))}
      onDragEnd={(event, info) =>
        onDragEnd(member, team, pointFromEvent(event, info))
      }
      className="flex items-center justify-between gap-2 bg-card py-2"
    >
      <div className="flex min-w-0 items-center gap-1.5">
        <button
          type="button"
          aria-label={`Drag ${member.full_name} to another team`}
          onPointerDown={(e) => controls.start(e)}
          className="shrink-0 cursor-grab touch-none text-muted-foreground/60 active:cursor-grabbing"
        >
          <GripVertical className="size-4" />
        </button>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{member.full_name}</p>
          <p className="truncate text-xs text-muted-foreground">{member.email}</p>
        </div>
      </div>
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={() => onView(member.registration_id)}
        aria-label={`View ${member.full_name}`}
        className="shrink-0 cursor-pointer text-muted-foreground"
      >
        <Eye className="size-4" />
      </Button>
    </motion.li>
  );
}
