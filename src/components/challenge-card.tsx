"use client";

import { useEffect, useState } from "react";

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

function getCountdown(target?: Date | string) {
  if (!target) return "TBD";

  const difference = new Date(target).getTime() - Date.now();

  if (difference <= 0) {
    return "Unlocked";
  }

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference / (1000 * 60 * 60)) % 24
  );
  const minutes = Math.floor(
    (difference / (1000 * 60)) % 60
  );
  const seconds = Math.floor(
    (difference / 1000) % 60
  );

  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
}


export default function ChallengeCard({
  department,
  title,
  unlocks_at,
}: ChallengeCardProps) {

  const [countdown, setCountdown] = useState(
    getCountdown(unlocks_at)
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown(getCountdown(unlocks_at));
    }, 1000);

    return () => clearInterval(interval);
  }, [unlocks_at]);


  const textColor =
    DEPARTMENT_COLORS[department] ||
    "var(--brand-marketing)";


  return (
    <div className="w-65 h-35 md:w-100 md:h-55 2xl:w-150 2xl:h-80 
    bg-[url('/Subtract.svg')] bg-contain bg-center bg-no-repeat 
    flex flex-col items-center justify-between p-4 px-6">

      <h1
        className="text-4xl font-heading font-bold text-center capitalize"
        style={{ color: textColor }}
      >
        {department}
      </h1>


      <div className="flex flex-1 flex-col items-start justify-around w-full">

        <h3
          className="text-2xl font-hand font-bold text-center"
          style={{ color: textColor }}
        >
          Challenge Title :
          <span className="text-black font-hand">
            {" "}{title}
          </span>
        </h3>


        <p
          className="text-2xl font-hand font-bold text-center"
          style={{ color: textColor }}
        >
          Unlocks in :
          <span className="text-black">
            {" "}{countdown}
          </span>
        </p>

      </div>
    </div>
  );
}