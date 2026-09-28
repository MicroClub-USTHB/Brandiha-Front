"use client";

import Image from "next/image";
import { useTheme } from "next-themes";
import { useIsClient } from "@/hooks/use-is-client";

function getTimerBackground(theme?: string) {
  switch (theme) {
    case "design":
      return "/timer-Design.svg";
    case "multimedia":
      return "/timer-Multimedia.svg";
    case "communication":
      return "/timer-Communication.svg";
    case "marketing":
      return "/timer-Marketing.svg";
    case "chameleon":
    default:
      return "/timer-Default.svg";
  }
}

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
  const { theme } = useTheme();
  const isClient = useIsClient();
  const timerBg = getTimerBackground(isClient ? theme : undefined);
  const medal = MEDALS[rank];

  const scoreBadge = (
    <div
      className="h-full w-20 lg:w-40 2xl:w-60 2xl:h-35 text-center text-black bg-contain bg-center bg-no-repeat flex items-center justify-center"
      style={{ backgroundImage: `url('${timerBg}')` }}
    >
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
