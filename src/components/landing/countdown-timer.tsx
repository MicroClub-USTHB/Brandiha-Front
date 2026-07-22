"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
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
    case "default":
    default:
      return "/timer-Default.svg";
  }
}

export function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
  const [time, setTime] = useState(() => getTimeLeft(targetDate));
  const { theme } = useTheme();

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

  const timerBackground = getTimerBackground(theme);

  return (
    <div
      className={cn(
        "relative z-10 w-full max-w-[min(100%,38rem)] overflow-hidden rounded-[1.5rem] lg:max-w-[min(100%,40rem)] xl:max-w-[min(100%,30rem)] 2xl:max-w-[min(100%,44rem)]",
        className,
      )}
    >
      <Image
        src={timerBackground}
        alt=""
        fill
        priority
        sizes="(max-width: 768px) 92vw, 704px"
        className="object-cover"
      />
      <div className="relative z-10 grid grid-cols-2 gap-1.5 p-1.5 sm:gap-2 sm:p-2 md:grid-cols-4 lg:p-2.5 xl:gap-0 xl:p-0 2xl:p-3.5">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="flex min-w-0 flex-col items-center justify-center rounded-[1rem] bg-transparent px-1.5 py-2 text-center sm:px-2 sm:py-2.5 lg:px-2.5 lg:py-3 xl:px-3 xl:py-3.25"
          >
            <span className="font-heading text-[1.7rem] leading-none text-white tabular-nums drop-shadow-[0_1px_1px_rgba(0,0,0,0.25)] sm:text-[1.85rem] lg:text-[2.2rem] xl:text-[2.55rem] 2xl:text-[2.9rem]">
              {String(unit.value).padStart(2, "0")}
            </span>
            <span className="mt-0.5 font-heading text-[0.5rem] uppercase tracking-[0.18em] text-white sm:text-[0.55rem] lg:text-[0.6rem] xl:text-[0.65rem]">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
