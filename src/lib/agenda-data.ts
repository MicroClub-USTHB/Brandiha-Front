export interface ScheduleItem {
  time: string;
  title: string;
  badge?: string;
  note?: string;
}

export interface AgendaCardData {
  dayNumber: string;
  title: string;
  stopsCount: string;
  imageSrc: string;
  accentValue: string;
  rotateClass: string;
  contentRotateClass: string;
  contentOffsetClass: string;
  sizeClass?: string;
  schedule: ScheduleItem[];
}

export const BRANDIHA_AGENDA_DATA: AgendaCardData[] = [
  {
    dayNumber: "DAY1",
    title: "SKETCH",
    stopsCount: "5 stops",
    imageSrc: "/orange-card.png",
    accentValue: "oklch(0.6734 0.1841 45.03)",
    rotateClass: "-rotate-3",
    contentRotateClass: "-rotate-4",
    contentOffsetClass: "translate-x-1 translate-y-0",
    schedule: [
      { time: "15h → 16h30", title: "Check in" },
      { time: "16h → 17h", title: "Opening ceremony" },
      { time: "17h", title: "Work begins" },
      { time: "21h → 22h", title: "Dinner" },
      { time: "22h → 2h", title: "Work" },
    ],
  },
  {
    dayNumber: "DAY2",
    title: "FILL-IN",
    stopsCount: "12 stops",
    imageSrc: "/pink-card.png",
    accentValue: "oklch(0.6298 0.2193 3.49)",
    rotateClass: "rotate-2",
    contentRotateClass: "rotate-10",
    contentOffsetClass: "translate-x-5 translate-y-0",
    sizeClass: "w-[230px] h-[332px] lg:w-[270px] lg:h-[365px]",
    schedule: [
      { time: "2h → 3h30", title: "Coffee break" },
      { time: "3h30 → 8h", title: "Work" },
      { time: "8h → 9h", title: "Breakfast" },
      { time: "9h → 11h", title: "Work" },
      {
        time: "11h → 13h",
        title: "Pitching and announcement of the 2nd challenge",
      },
      { time: "13h → 14h", title: "prayer" },
      { time: "14h → 15h", title: "Lunch" },
      { time: "15h → 16h30", title: "Workshop/talk" },
      { time: "16h30 → 17h30", title: "Activities" },
      { time: "17h30 → 21h", title: "Work on the teaser begins" },
      { time: "21h → 22h", title: "Dinner" },
      { time: "22h → 2h", title: "Work" },
    ],
  },
  {
    dayNumber: "DAY3",
    title: "OUTLINE",
    stopsCount: "10 stops",
    imageSrc: "/blue-card.png",
    accentValue: "oklch(0.6747 0.1787 250.27)",
    rotateClass: "-rotate-2",
    contentRotateClass: "-rotate-4",
    contentOffsetClass: "translate-x-2 translate-y-0",
    schedule: [
      { time: "2h → 3h30", title: "Coffee break" },
      { time: "3h30 → 8h", title: "Work" },
      { time: "8h → 9h", title: "Breakfast" },
      { time: "9h → 13h", title: "Work" },
      { time: "13h → 14h", title: "Lunch" },
      { time: "14h → 15h30", title: "Workshop/talk" },
      { time: "15h30 → 16h30", title: "Activities" },
      { time: "16h30 → 21h", title: "Work" },
      { time: "21h → 22h", title: "Dinner" },
      { time: "22h → 2h", title: "Work" },
    ],
  },
  {
    dayNumber: "DAY4",
    title: "FINAL PIECE",
    stopsCount: "9 stops",
    imageSrc: "/cyan-card.png",
    accentValue: "oklch(0.8971 0.1605 180.46)",
    rotateClass: "rotate-3",
    contentRotateClass: "-rotate-2",
    contentOffsetClass: "translate-x-0 translate-y-0",
    schedule: [
      { time: "2h → 3h30", title: "Coffee break + activities" },
      { time: "3h30 → 8h", title: "Work" },
      { time: "8h → 9h", title: "Breakfast" },
      { time: "9h → 11h", title: "Work" },
      { time: "11h → 12h", title: "Submission" },
      { time: "12h → 13h", title: "Activities" },
      { time: "13h → 14h", title: "Lunch" },
      { time: "14h → 17h00", title: "Teasers projection" },
      {
        time: "17h00 → 17h30",
        title: "Announcement of results and closing ceremony",
      },
    ],
  },
];