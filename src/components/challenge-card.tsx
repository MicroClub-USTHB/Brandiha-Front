"use client";

import { useSyncExternalStore } from "react";
import Image from "next/image";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChallengeWindow } from "@/lib/api/challenge-types";

export enum Department {
  MARKETING = "marketing",
  COMMUNICATION = "communication",
  MULTIMEDIA = "multimedia",
  DESIGN = "design",
}

interface ChallengeCardProps {
  id?: number;
  department: Department;
  title?: string;
  unlocks_at?: Date | string;
  ends_at?: Date | string;
}

const DEPARTMENT_COLORS: Record<Department, string> = {
  [Department.MARKETING]: "var(--brand-marketing)",
  [Department.COMMUNICATION]: "var(--brand-communication)",
  [Department.MULTIMEDIA]: "var(--brand-multimedia)",
  [Department.DESIGN]: "var(--brand-design)",
};

const DEPARTMENT_CARDS: Record<Department, string> = {
  [Department.MARKETING]: "marketing-card.svg",
  [Department.COMMUNICATION]: "communication-card.svg",
  [Department.MULTIMEDIA]: "multimedia-card.svg",
  [Department.DESIGN]: "design-card.svg",
};

const DEPARTMENT_MASCOTS: Record<Department, string> = {
  [Department.MARKETING]: "marketing-mascot.png",
  [Department.COMMUNICATION]: "communication-mascot.png",
  [Department.MULTIMEDIA]: "multimedia-mascot.png",
  [Department.DESIGN]: "design-mascot.png",
};


/** Time left until unlock, as `1d 2h 3m 4s`. */
function formatCountdown(remaining: number) {
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}

/** `null` for a missing or unparseable timestamp, so NaN never reaches the UI. */
function toTime(value?: Date | string) {
  if (!value) return null;

  const time = new Date(value).getTime();
  return Number.isFinite(time) ? time : null;
}

/**
 * Mirrors `resolveWindow` in `lib/api/challenges.ts`, which is what the detail
 * page behind this card uses — a card and the page it links to shouldn't
 * disagree about whether a challenge is open. No unlock time reads as upcoming.
 */
function resolveWindow(
  now: number,
  unlocksAt: number | null,
  endsAt: number | null,
): ChallengeWindow {
  if (unlocksAt === null || unlocksAt > now) return "upcoming";
  if (endsAt !== null && endsAt <= now) return "closed";
  return "open";
}

/**
 * One second-ticking clock shared by every card on the page, rather than an
 * interval each. The interval only runs while at least one card is mounted.
 */
const clock = {
  now: Date.now(),
  listeners: new Set<() => void>(),
  interval: null as ReturnType<typeof setInterval> | null,
};

function subscribeToClock(onTick: () => void) {
  clock.listeners.add(onTick);

  if (clock.interval === null) {
    clock.now = Date.now();
    clock.interval = setInterval(() => {
      clock.now = Date.now();
      clock.listeners.forEach((listener) => listener());
    }, 1000);
  }

  return () => {
    clock.listeners.delete(onTick);

    if (clock.listeners.size === 0 && clock.interval !== null) {
      clearInterval(clock.interval);
      clock.interval = null;
    }
  };
}

/**
 * `null` until mounted on the client. Rendering a time on the server would
 * bake the server's clock into the HTML down to the second, and the client's
 * first render would immediately disagree with it — a hydration mismatch on
 * every card, every load.
 */
function useNow() {
  return useSyncExternalStore(
    subscribeToClock,
    () => clock.now,
    () => null,
  );
}

/**
 * Only locked cards carry a label — an open one says so by being in color,
 * with its mascot showing, so there is nothing left to spell out.
 */
function lockedLabel(
  submissionWindow: Exclude<ChallengeWindow, "open">,
  now: number,
  unlocksAt: number | null,
) {
  if (submissionWindow === "closed") return "Closed";

  return unlocksAt === null ? "TBD" : formatCountdown(unlocksAt - now);
}


export default function ChallengeCard({
  department,
  title,
  unlocks_at,
  ends_at,
}: ChallengeCardProps) {
  // One clock decides the whole card's look, so the color, the mascot and the
  // countdown can't disagree about whether the challenge is open.
  const now = useNow();

  const textColor =
    DEPARTMENT_COLORS[department] ||
    "var(--brand-marketing)";

  const unlocksAt = toTime(unlocks_at);
  const endsAt = toTime(ends_at);
  const submissionWindow =
    now === null ? null : resolveWindow(now, unlocksAt, endsAt);

  // Shut until the clock says otherwise — a closed challenge is locked again.
  // Until then the card is in neither state, so it commits to neither look:
  // showing the wrong one for a frame would flash a mascot onto a locked card,
  // or drain the color out of an open one.
  const isLocked = submissionWindow !== null && submissionWindow !== "open";
  const label =
    now === null || !isLocked
      ? null
      : lockedLabel(submissionWindow, now, unlocksAt);

  // An unopened challenge keeps its brief to itself — the real title is a hint
  // at the work, so it stays hidden until the card unlocks. A closed one has
  // already been worked on, so there is nothing left to withhold.
  const heading =
    submissionWindow === "upcoming" ? "Coming Soon..." : title;

  const cardImage =
    DEPARTMENT_CARDS[department] ||
    "marketing-card.svg";

  const mascot =
    DEPARTMENT_MASCOTS[department] ||
    "marketing-mascot.png";

  return (
    <div
      className={cn(
        "w-45 md:w-65 2xl:w-85 aspect-square bg-contain bg-center bg-no-repeat flex flex-col items-center justify-between px-6 py-8",
        // Drains the department color out of the card art and the title too,
        // not just the slot below — a locked card reads as inert at a glance.
        "transition-[filter] duration-500",
        isLocked && "grayscale",
      )}
      style={{ backgroundImage: `url('/challenge-cards/${cardImage}')` }}
    >
      <h1
        className="text-xl md:text-2xl xl:text-3xl font-heading font-bold text-center capitalize"
        style={{ color: textColor }}
      >
        {/* One word per line: `block` on each word rather than a width
            constraint, so wrapping doesn't depend on the card's size. */}
        {heading
          ?.trim()
          .split(/\s+/)
          .map((word, i) => (
            <span key={`${word}-${i}`} className="block">
              {word}
            </span>
          ))}
      </h1>


      {/* The card's one variable slot: the mascot when open, the lock and its
          countdown when not. `min-h-0` lets it shrink below the mascot's
          intrinsic height, so a long title takes room from this slot instead
          of overflowing. */}
      <div className="flex min-h-0 flex-1 items-center justify-center py-1">
        {isLocked ? (
          // `currentColor` on the wrapper is what makes both the icon and the
          // countdown track the department color (grayscaled by the parent).
          <div
            className="flex flex-col items-center gap-2"
            style={{ color: textColor }}
          >
            {/* Decorative: the countdown below already states the same thing. */}
            <Lock className="size-6 md:size-8 xl:size-10 shrink-0" aria-hidden />
            <span className="lg:text-xl font-hand font-bold">{label}</span>
          </div>
        ) : (
          <Image
            src={`/department-mascots/${mascot}`}
            alt={`${department} mascot`}
            width={292}
            height={283}
            draggable={false}
            // Held in the layout but unseen until the clock says the challenge
            // is open, so an open card doesn't have to reflow to show it.
            className={cn(
              "h-[80%] object-contain",
              submissionWindow === null && "invisible",
            )}
          />
        )}
      </div>
    </div>
  );
}
