"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

const emptySubscribe = () => () => {};

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
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
  const [time, setTime] = useState(() => getTimeLeft(targetDate));

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft(targetDate)), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!mounted) {
    return (
      <div className={cn("relative z-10 flex gap-4", className)}>
        {["Days", "Hours", "Min", "Sec"].map((label) => (
          <div
            key={label}
            className="flex flex-col items-center rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-6 py-4"
          >
            <span className="text-5xl font-bold tabular-nums text-white">
              --
            </span>
            <span className="mt-1 text-sm font-medium text-white/80 uppercase tracking-wider">
              {label}
            </span>
          </div>
        ))}
      </div>
    );
  }

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Min", value: time.minutes },
    { label: "Sec", value: time.seconds },
  ];

  return (
    <div className={cn("relative z-10 flex gap-4", className)}>
      {units.map((unit) => (
        <div
          key={unit.label}
          className="flex flex-col items-center rounded-xl border border-white/30 bg-white/20 backdrop-blur-sm px-6 py-4"
        >
          <span className="text-5xl font-bold tabular-nums text-white">
            {String(unit.value).padStart(2, "0")}
          </span>
          <span className="mt-1 text-sm font-medium text-white/80 uppercase tracking-wider">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
