"use client";

import { useEffect, useSyncExternalStore } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Clock, Lock } from "lucide-react";
import { cn } from "@/lib/utils";
import { resolveWindow, toTime } from "@/lib/api/challenge-window";
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
  /**
   * The window as the server saw it, used for the first paint. Without it the
   * card would have to guess before the client clock is readable, and a locked
   * card would flash its real title in full color on every load.
   */
  initialWindow: ChallengeWindow;
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

const DEPARTMENT_CARDS_GRAY: Record<Department, string> = {
  [Department.MARKETING]: "marketing-card-gray.svg",
  [Department.COMMUNICATION]: "communication-card-gray.svg",
  [Department.MULTIMEDIA]: "multimedia-card-gray.svg",
  [Department.DESIGN]: "design-card-gray.svg",
};

const DEPARTMENT_MASCOTS: Record<Department, string> = {
  [Department.MARKETING]: "marketing-mascot.png",
  [Department.COMMUNICATION]: "communication-mascot.png",
  [Department.MULTIMEDIA]: "multimedia-mascot.png",
  [Department.DESIGN]: "design-mascot.png",
};


/** Time left, as `1d 2h 3m 4s` — to the unlock when locked, the deadline when open. */
function formatCountdown(remaining: number) {
  const days = Math.floor(remaining / (1000 * 60 * 60 * 24));
  const hours = Math.floor((remaining / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((remaining / (1000 * 60)) % 60);
  const seconds = Math.floor((remaining / 1000) % 60);

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
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
 *
 * Which is why the window itself arrives as a prop instead: it only changes at
 * the unlock boundary, so the server can resolve it safely. Only the countdown
 * has to wait for this.
 */
function useNow() {
  return useSyncExternalStore(
    subscribeToClock,
    () => clock.now,
    () => null,
  );
}

/**
 * How long until an upcoming challenge unlocks, or `TBD` when there is no
 * usable unlock time to count towards.
 */
function unlockLabel(now: number, unlocksAt: number | null) {
  return unlocksAt === null ? "TBD" : formatCountdown(unlocksAt - now);
}


export default function ChallengeCard({
  department,
  title,
  unlocks_at,
  ends_at,
  initialWindow,
}: ChallengeCardProps) {
  // One clock decides the whole card's look, so the color, the mascot and the
  // countdown can't disagree about whether the challenge is open.
  const now = useNow();

  const unlocksAt = toTime(unlocks_at);
  const endsAt = toTime(ends_at);
  // The server's answer holds the first paint; the client clock takes over on
  // mount and from then on ticks the card open the moment it unlocks.
  const submissionWindow =
    now === null ? initialWindow : resolveWindow(now, unlocksAt, endsAt);

  // Shut until the clock says otherwise — a closed challenge is locked again,
  // and drained of its color the same way.
  const isLocked = submissionWindow !== "open";

  const textColor = isLocked
    ? "#888888"
    : DEPARTMENT_COLORS[department] || "var(--brand-marketing)";

  // Only a challenge that hasn't unlocked hides its mascot: there is nothing to
  // show off yet, and a lock is the whole message. A closed one keeps the
  // mascot — it did run — and says it's over in the line underneath instead.
  const isUpcoming = submissionWindow === "upcoming";
  const isClosed = submissionWindow === "closed";

  // A card that ticks open on screen was rendered without its title, since the
  // server had no reason to send one yet. Ask the server again rather than
  // leave "Coming Soon..." over an unlocked card until the next reload.
  //
  // Can't loop: the refresh only clears this once the server agrees the
  // challenge is open, and until it does the condition is unchanged.
  const awaitingTitle = submissionWindow === "open" && title === undefined;
  const router = useRouter();

  useEffect(() => {
    if (awaitingTitle) router.refresh();
  }, [awaitingTitle, router]);

  // Only the countdowns have to wait for the client clock, so they alone are
  // blank on the first paint — everything else is already in its final state.
  const unlockCountdown =
    isUpcoming && now !== null ? unlockLabel(now, unlocksAt) : null;

  // The line under the mascot: an open challenge counts down to its deadline, a
  // closed one just states that it's over. An open challenge without an
  // `ends_at` runs indefinitely, so it gets no line at all rather than an empty
  // one — there is no deadline to be counting towards.
  const hasStatusLine =
    isClosed || (submissionWindow === "open" && endsAt !== null);
  const StatusIcon = isClosed ? Lock : Clock;
  // "Closed" is a fact about the window, settled before the card ever renders,
  // so unlike a countdown it doesn't have to wait for the client clock.
  const statusLabel = isClosed
    ? "Closed"
    : endsAt !== null && now !== null
      ? formatCountdown(endsAt - now)
      : null;

  // The server withholds an upcoming challenge's title outright rather than
  // sending one for the card to hide, so there is nothing to decide here: the
  // placeholder stands in whenever the title is absent.
  const heading = title ?? "Coming Soon...";

  const cardImage =
    (isLocked
      ? DEPARTMENT_CARDS_GRAY[department]
      : DEPARTMENT_CARDS[department]) || "marketing-card.svg";

  const mascot =
    DEPARTMENT_MASCOTS[department] ||
    "marketing-mascot.png";

  return (
    <div
      className={cn(
        "w-45 md:w-65 2xl:w-85 aspect-square bg-contain bg-center bg-no-repeat flex flex-col items-center justify-between px-6 py-8",
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


      {/* The card's one variable slot: the mascot over a status line once the
          challenge has unlocked, the lock over its countdown before it has.
          `min-h-0` lets it shrink below the mascot's intrinsic height, so a long
          title takes room from this slot instead of overflowing. */}
      <div className="flex min-h-0 flex-1 items-center justify-center py-1">
        {isUpcoming ? (
          // `currentColor` on the wrapper is what makes both the icon and the
          // countdown track the department color (grayscaled by the parent).
          <div
            className="flex flex-col items-center gap-2"
            style={{ color: textColor }}
          >
            {/* Decorative: the countdown below already states the same thing. */}
            <Lock className="size-6 md:size-8 xl:size-10 shrink-0" aria-hidden />
            {/* A non-breaking space holds the line's height until the clock is
                read, so the card doesn't reflow when the countdown appears. */}
            <span className="lg:text-xl font-hand font-bold">
              {unlockCountdown ?? " "}
            </span>
          </div>
        ) : (
          <div className="flex h-full min-h-0 flex-col items-center justify-center gap-1">
            <Image
              src={`/department-mascots/${mascot}`}
              alt={`${department} mascot`}
              width={292}
              height={283}
              draggable={false}
              // Takes the slack the status line leaves, so a card without one
              // gets a taller mascot rather than a gap under it.
              className="min-h-0 w-auto max-w-full flex-1 object-contain"
            />

            {hasStatusLine && (
              // `currentColor` on the wrapper is what makes both the icon and
              // the label track the department color (grayscaled by the parent
              // once the challenge is closed).
              <div
                className="flex items-center gap-1.5"
                style={{ color: textColor }}
              >
                {/* Decorative: the label beside it says the same thing. */}
                <StatusIcon
                  className="size-4 md:size-5 xl:size-6 shrink-0"
                  aria-hidden
                />
                {/* A non-breaking space holds the line's height until the clock
                    is read, so the card doesn't reflow when it appears. */}
                <span className="lg:text-xl font-hand font-bold">
                  {statusLabel ?? " "}
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
