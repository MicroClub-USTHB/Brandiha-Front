"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Lock, LockOpen } from "lucide-react";

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


export default function ChallengeCard({
  department,
  title,
  unlocks_at,
}: ChallengeCardProps) {
  // One clock for both the icon and the countdown, so they can't disagree
  // about whether the challenge is open.
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);

    return () => clearInterval(interval);
  }, []);

  const textColor =
    DEPARTMENT_COLORS[department] ||
    "var(--brand-marketing)";

  const unlocksAt = unlocks_at ? new Date(unlocks_at).getTime() : null;
  // No unlock time yet counts as locked, not open.
  const unlocked = unlocksAt !== null && unlocksAt <= now;
  const LockIcon = unlocked ? LockOpen : Lock;

  const cardImage =
    DEPARTMENT_CARDS[department] ||
    "marketing-card.svg";

  const mascot =
    DEPARTMENT_MASCOTS[department] ||
    "marketing-mascot.png";

  return (
    <div
      className="w-45 md:w-65 2xl:w-85 aspect-square bg-contain bg-center bg-no-repeat flex flex-col items-center justify-between px-6 py-8"
      style={{ backgroundImage: `url('/challenge-cards/${cardImage}')` }}
    >
      <h1
        className="text-xl md:text-2xl xl:text-3xl font-heading font-bold text-center capitalize"
        style={{ color: textColor }}
      >
        {/* One word per line: `block` on each word rather than a width
            constraint, so wrapping doesn't depend on the card's size. */}
        {title
          ?.trim()
          .split(/\s+/)
          .map((word, i) => (
            <span key={`${word}-${i}`} className="block">
              {word}
            </span>
          ))}
      </h1>


      {/* `min-h-0` lets this slot shrink below the mascot's intrinsic height,
          so a long title takes room from the mascot instead of overflowing. */}
      <div className="flex min-h-0 flex-1 items-center justify-center py-1">
        <Image
          src={`/department-mascots/${mascot}`}
          alt={`${department} mascot`}
          width={292}
          height={283}
          draggable={false}
          className="h-[80%] object-contain"
        />
      </div>

      <div className="flex flex-col items-center w-full">
        {/* `currentColor` on the wrapper is what makes both the icon and the
            countdown track the department color. */}
        <div
          className="flex flex-col items-center gap-1"
          style={{ color: textColor }}
        >
          {/* Decorative: the label below already states the same thing. */}
          <LockIcon className="size-4 md:size-5 xl:size-6 shrink-0" aria-hidden />
          <span className="lg:text-xl font-hand font-bold">
            {unlocked
              ? "Unlocked"
              : unlocksAt === null
                ? "TBD"
                : formatCountdown(unlocksAt - now)}
          </span>
        </div>
      </div>
    </div>
  );
}
