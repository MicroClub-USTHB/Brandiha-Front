"use client";

import Image from "next/image";
import { TimerFrame } from "@/components/theme-art/timer-frame";

/** The top three get a medal in place of their rank number. */
const MEDALS: Partial<Record<number, { src: string; alt: string }>> = {
  1: { src: "/gold.svg", alt: "Gold Medal" },
  2: { src: "/silver.svg", alt: "Silver Medal" },
  3: { src: "/bronze.svg", alt: "Bronze Medal" },
};

interface LeaderboardRowProps {
  rank: number;
  teamName: string;
  score: number;
  actions?: React.ReactNode;
}

export default function LeaderboardRow({
  rank,
  teamName,
  score,
  actions,
}: LeaderboardRowProps) {
  const medal = MEDALS[rank];

  const scoreBadge = (
    <div
      className="relative isolate h-full w-20 lg:w-40 2xl:w-60 2xl:h-35 text-center text-black flex items-center justify-center"
    >
      {/* Fitted and centred, like the `bg-contain bg-center` it replaces. */}
      <TimerFrame className="pointer-events-none absolute inset-0 -z-10 size-full" />
      <span className="text-xl lg:text-4xl 2xl:text-7xl font-heading text-white font-bold">
        {score}
      </span>
    </div>
  );

  // Plain elements rather than headings: every row used to be an `<h1>`, so a
  // board of twenty teams had twenty top-level headings under the page's own.
  return (
    <div>
      <div
        className="bg-paper w-90 h-15 lg:w-250 lg:h-15 2xl:w-290 2xl:h-25 py-2 px-4 flex items-center justify-between mb-2"
      >
        <div className="flex flex-row items-center justify-start gap-4">
          {medal ? (
            <Image
              height={22}
              width={22}
              src={medal.src}
              alt={medal.alt}
              className="w-22 h-22 2xl:w-35 2xl:h-35 mt-2"
            />
          ) : (
            <span className="text-3xl lg:text-5xl 2xl:text-7xl h-22 w-22 2xl:w-35 2xl:h-35 flex items-center justify-center font-heading font-bold text-center text-black">
              {rank}
            </span>
          )}
          <div className="flex items-center justify-center">
            <span className="text-xl lg:text-5xl 2xl:text-7xl font-heading text-black font-bold">
              {teamName}
            </span>
          </div>
        </div>
        {actions ? (
          <div className="flex items-center justify-end gap-2">
            {actions}
            {scoreBadge}
          </div>
        ) : (
          scoreBadge
        )}
      </div>
    </div>
  );
}
