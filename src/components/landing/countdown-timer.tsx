"use client";

import Image from "next/image";
import { useEffect, useSyncExternalStore, useState } from "react";
import { useTheme } from "next-themes";

const useIsClient = () => useSyncExternalStore(() => () => {}, () => true, () => false);
import { cn } from "@/lib/utils";

function getTimeLeft(target: Date) {
  const diff = Math.max(0, target.getTime() - Date.now());
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

interface CountdownTimerProps {
  targetDate: Date;
  className?: string;
}

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

export function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const { theme } = useTheme();
  const isClient = useIsClient();

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  const timerBackground = getTimerBackground(isClient ? theme : undefined);

  return (
    <div
      className={cn(
        "relative z-10 overflow-hidden min-w-[30svw] max-w-[80svw] px-8 py-3 grid grid-cols-4 text-white gap-5",
        className,
      )}

      style={{
        backgroundImage: `url('${timerBackground}')`,
        backgroundSize: "100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      {units.map((unit) =>
        <div
          key={unit.label}
          className="flex min-w-0 flex-col items-center justify-center text-center"
        >
          <span className="font-heading drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] text-3xl font-bold sm:text-4xl">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="font-heading uppercase text-white">
            {unit.label}
          </span>
        </div>
      )}
    </div >
  );
}
