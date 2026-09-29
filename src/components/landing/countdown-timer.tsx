"use client";

import { useEffect, useState } from "react";

import { cn } from "@/lib/utils";
import { TimerFrame } from "@/components/theme-art/timer-frame";

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

export function CountdownTimer({ targetDate, className }: CountdownTimerProps) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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

  return (
    <div
      className={cn(
        "relative z-10 overflow-hidden min-w-[30svw] max-w-[80svw] px-8 py-3 grid grid-cols-4 text-white gap-5",
        className,
      )}
    >
      {/* Full width, natural height, pinned top-left — what the old
          `background-size: 100%` did. */}
      <TimerFrame className="pointer-events-none absolute left-0 top-0 -z-10 h-auto w-full" />
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
