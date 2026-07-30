"use client";

import Image from "next/image";
import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";

const useIsClient = () => useSyncExternalStore(() => () => {}, () => true, () => false);

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

  return (
    <div>
      <div
        className="w-90 h-15 lg:w-250 lg:h-15 2xl:w-290 2xl:h-25 py-2 px-4 flex items-center justify-between mb-2"
        style={{
          backgroundImage: "url('/paper.svg')",
          backgroundSize: "100% 100%",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="flex flex-row items-center justify-start gap-4">
          {rank === 1 && (
            <Image
              height={22}
              width={22}
              src="/gold.svg"
              alt="Gold Medal"
              className="w-22 h-22 2xl:w-35 2xl:h-35 mt-2"
            />
          )}
          {rank === 2 && (
            <Image
              height={22}
              width={22}
              src="/silver.svg"
              alt="Silver Medal"
              className="w-22 h-22 2xl:w-35 2xl:h-35 mt-2"
            />
          )}
          {rank === 3 && (
            <Image
              height={22}
              width={22}
              src="/bronze.svg"
              alt="Bronze Medal"
              className="w-22 h-22 2xl:w-35 2xl:h-35 mt-2"
            />
          )}
          {rank > 3 && (
            <span className="text-3xl lg:text-5xl 2xl:text-7xl lg:mb-3 2xl:mb-3 h-22 w-22 2xl:w-35 2xl:h-35 flex items-center justify-center font-heading font-bold text-center text-black">
              {rank}
            </span>
          )}
          <h1 className="flex items-center justify-center">
            <span className="text-xl lg:text-5xl 2xl:text-7xl lg:mb-3 2xl:mb-3 font-heading text-black font-bold">
              {teamName}
            </span>
          </h1>
        </div>
        {actions ? (
          <div className="flex items-center justify-end gap-2">
            {actions}
            <h1
              className="h-full w-20 lg:w-40 2xl:w-60 2xl:h-35 text-center text-black bg-contain bg-center bg-no-repeat flex items-center justify-center"
              style={{ backgroundImage: `url('${timerBg}')` }}
            >
              <span className="text-xl lg:text-4xl 2xl:text-7xl lg:mb-3 2xl:mb-3 font-heading text-white font-bold">
                {score}
              </span>
            </h1>
          </div>
        ) : (
          <h1
            className="h-full w-20 lg:w-40 2xl:w-60 2xl:h-35 text-center text-black bg-contain bg-center bg-no-repeat flex items-center justify-center"
            style={{ backgroundImage: `url('${timerBg}')` }}
          >
            <span className="text-xl lg:text-4xl 2xl:text-7xl lg:mb-3 2xl:mb-3 font-heading text-white font-bold">
              {score}
            </span>
          </h1>
        )}
      </div>
    </div>
  );
}
