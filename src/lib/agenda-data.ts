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
    stopsCount: "5 stops",
    imageSrc: "/orange-card.png",
    accentColor: "text-orange-500",
    rotateClass: "-rotate-3",
    contentRotateClass: "-rotate-4",
    contentOffsetClass: "translate-x-1 translate-y-0",
    schedule: [
      { time: "15h → 16h30", title: "Check-in" },
      { time: "16h → 17h", title: "Cérémonie d’ouverture" },
      { time: "17h", title: "Debut des travaux" },
      { time: "21h → 22h", title: "Dîner" },
      { time: "22h → 2h", title: "Travaux" },
    ],
  },
  {
    dayNumber: "DAY2",
    title: "FILL-IN",
    stopsCount: "12 stops",
    imageSrc: "/pink-card.png",
    accentColor: "text-pink-500",
    rotateClass: "rotate-2",
    contentRotateClass: "rotate-10",
    contentOffsetClass: "translate-x-5 translate-y-0",
    sizeClass: "w-[230px] h-[332px] lg:w-[270px] lg:h-[365px]",
    schedule: [
      { time: "2h → 3h30", title: "Collation" },
      { time: "3h30 → 8h", title: "Travaux" },
      { time: "8h → 9h", title: "Petit dejeuner" },
      { time: "9h → 11h", title: "Travaux" },
      { time: "11h → 13h", title: "Pitching et annonce du 2e challenge" },
      { time: "13h → 14h", title: "Priere" },
      { time: "14h → 15h", title: "Dejeuner" },
      { time: "15h → 16h30", title: "Workshop / talk" },
      { time: "16h30 → 17h30", title: "Activites" },
      { time: "17h30 → 21h", title: "Début du travail sur le teaser" },
      { time: "21h → 22h", title: "Dîner" },
      { time: "22h → 2h", title: "Travaux" },
    ],
  },
  {
    dayNumber: "DAY3",
    title: "OUTLINE",
    stopsCount: "10 stops",
    imageSrc: "/blue-card.png",
    accentColor: "text-blue-500",
    rotateClass: "-rotate-2",
    contentRotateClass: "-rotate-4",
    contentOffsetClass: "translate-x-2 translate-y-0",
    schedule: [
      { time: "2h → 3h30", title: "Collation" },
      { time: "3h30 → 8h", title: "Travaux" },
      { time: "8h → 9h", title: "Petit dejeuner" },
      { time: "9h → 13h", title: "Travaux" },
      { time: "13h → 14h", title: "Dejeuner" },
      { time: "14h → 15h30", title: "Workshop / talk" },
      { time: "15h30 → 16h30", title: "Activites" },
      { time: "16h30 → 21h", title: "Travaux" },
      { time: "21h → 22h", title: "Dîner" },
      { time: "22h → 2h", title: "Travaux" },
    ],
  },
  {
    dayNumber: "DAY4",
    title: "FINAL PIECE",
    stopsCount: "9 stops",
    imageSrc: "/cyan-card.png",
    accentColor: "text-cyan-400",
    rotateClass: "rotate-3",
    contentRotateClass: "-rotate-2",
    contentOffsetClass: "translate-x-0 translate-y-0",
    schedule: [
      { time: "2h → 3h30", title: "Collation + activites" },
      { time: "3h30 → 8h", title: "Travaux" },
      { time: "8h → 9h", title: "Petit dejeuner" },
      { time: "9h → 11h", title: "Travaux" },
      { time: "11h → 12h", title: "Submissions" },
      { time: "12h → 13h", title: "Activites" },
      { time: "13h → 14h", title: "Dejeuner" },
      { time: "14h30 → 16h30", title: "Presentation et Projection des teasers" },
      { time: "16h30 → 17h30", title: "Annonce des résultats et cérémonie de clôture" },
    ],
  },
];