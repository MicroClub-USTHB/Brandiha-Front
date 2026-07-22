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
  accentColor: string;
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
    stopsCount: "4 stops",
    imageSrc: "/orange-card.png",
    accentColor: "text-orange-500",
    rotateClass: "-rotate-3",
    contentRotateClass: "-rotate-4",
    contentOffsetClass: "translate-x-1 translate-y-0",
    schedule: [
      { time: "15:00", title: "Check-in" },
      { time: "16:00", title: "Opening ceremony" },
      { time: "17:00", title: "Works begins", badge: "Lines are drawn", note: "~4h work" },
      { time: "21:00", title: "Dinner", note: "~4h work (overnight)" },
    ],
  },
  {
    dayNumber: "DAY2",
    title: "FILL-IN",
    stopsCount: "9 stops",
    imageSrc: "/pink-card.png",
    accentColor: "text-pink-500",
    rotateClass: "rotate-2",
    contentRotateClass: "rotate-10",
    contentOffsetClass: "translate-x-5 translate-y-0",
    sizeClass: "w-[230px] h-[332px] lg:w-[270px] lg:h-[365px]",
    schedule: [
      { time: "09:00", title: "Morning Briefing" },
      { time: "10:00", title: "Color block application" },
      { time: "13:00", title: "Lunch Break" },
      { time: "14:30", title: "Detailed Fill-in Session" },
    ],
  },
  {
    dayNumber: "DAY3",
    title: "OUTLINE",
    stopsCount: "6 stops",
    imageSrc: "/blue-card.png",
    accentColor: "text-blue-500",
    rotateClass: "-rotate-2",
    contentRotateClass: "-rotate-4",
    contentOffsetClass: "translate-x-2 translate-y-0",
    schedule: [
      { time: "10:00", title: "Review session" },
      { time: "11:30", title: "Inking and Outlining" },
      { time: "15:00", title: "Refining Edges" },
    ],
  },
  {
    dayNumber: "DAY4",
    title: "FINAL PIECE",
    stopsCount: "7 stops",
    imageSrc: "/cyan-card.png",
    accentColor: "text-cyan-400",
    rotateClass: "rotate-3",
    contentRotateClass: "-rotate-2",
    contentOffsetClass: "translate-x-0 translate-y-0",
    schedule: [
      { time: "11:00", title: "Final Touches" },
      { time: "14:00", title: "Exhibition Setup" },
      { time: "18:00", title: "Closing Ceremony & Showcase" },
    ],
  },
];