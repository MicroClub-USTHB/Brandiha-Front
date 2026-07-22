import Image from "next/image";
import { Circle } from "lucide-react";
import { AgendaCardData } from "@/lib/agenda-data";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";

interface CustomCardProps {
  card: AgendaCardData;
}

const CARD_BOX = "w-[230px] h-[320px] lg:w-[250px] lg:h-[347px]";

export function CustomCard({ card }: CustomCardProps) {
  const {
    dayNumber,
    title,
    stopsCount,
    imageSrc,
    accentColor,
    rotateClass = "rotate-0",
    contentRotateClass = "rotate-0",
    contentOffsetClass = "translate-x-0 translate-y-0",
    sizeClass,
    schedule,
  } = card;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className={`relative ${sizeClass ?? CARD_BOX} shrink-0 cursor-pointer drop-shadow-[0_18px_20px_rgba(0,0,0,0.5)] transition-all duration-300 hover:z-20 hover:-translate-y-3 hover:rotate-0 hover:scale-105 ${rotateClass}`}
        >
          <Image
            src={imageSrc}
            alt={`${dayNumber} Card`}
            fill
            sizes="250px"
            className="select-none object-fill rounded-2xl"
            draggable={false}
            priority
          />

          <div
            className={`absolute inset-y-8 inset-x-6 flex flex-col justify-between ${contentRotateClass} ${contentOffsetClass}`}
          >
            <div className="flex justify-start text-left">
              <div className="flex flex-col items-start">
                <div className="relative inline-block">
                  <h2
                    aria-hidden="true"
                    className="font-hand absolute inset-0 text-[2.2rem] font-bold leading-none tracking-tight text-white [-webkit-text-stroke:_8px_white] [paint-order:_stroke_fill] drop-shadow-[-3px_3px_0_#d1d5db]"
                  >
                    {dayNumber}
                  </h2>
                  <h2
                    className={`font-hand relative text-[2.2rem] font-bold leading-none tracking-tight ${accentColor}`}
                  >
                    {dayNumber}
                  </h2>
                </div>

                <h1 className="font-heading mt-2 text-[1.9rem] font-black uppercase leading-none tracking-wide text-white drop-shadow-[0_3px_3px_rgba(0,0,0,0.5)]">
                  {title}
                </h1>
              </div>
            </div>

            <div className="font-hand text-left text-base font-normal leading-none text-white">
              <p>{stopsCount}</p>
              <p className="uppercase">TAP TO PEEL →</p>
            </div>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="w-[90vw] !max-w-2xl bg-[#0d131a] border-none text-white p-8 rounded-3xl shadow-2xl [&>button]:hidden">
        <DialogHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
          <div>
            <DialogTitle className="font-heading text-7xl font-black tracking-wide text-white">
              {dayNumber.replace(/(\D+)(\d+)/, "$1 $2")}
            </DialogTitle>
            <DialogDescription className="sr-only">
              {dayNumber} {title} Schedule
            </DialogDescription>
            <div className="mt-2.5 inline-block rounded-lg bg-orange-500 px-4 py-1 font-hand text-2xl font-bold text-white shadow-md -rotate-3">
              {title}
            </div>
          </div>

          <DialogClose asChild>
            <button
              type="button"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1b2635] px-6 py-3 font-heading text-xl font-normal tracking-wide text-white shadow-lg transition-transform hover:scale-105 rotate-6"
            >
              <div className="relative h-5 w-5 flex items-center justify-center shrink-0">
                <div className="absolute h-[4px] w-full bg-white rounded-full rotate-45" />
                <div className="absolute h-[4px] w-full bg-white rounded-full -rotate-45" />
              </div>
              <span className="leading-none relative tracking-[0.04em] -top-[3px] rounded">
                PIN BACK UP
              </span>
            </button>
          </DialogClose>
        </DialogHeader>

        <div className="relative max-h-[60vh] overflow-y-auto pr-4 pl-4">
          <div className="absolute left-[28px] top-4 bottom-4 w-1 bg-orange-500" />

          <div className="space-y-8 relative">
            {schedule.map((item, index) => (
              <div key={index} className="flex items-start relative pl-10">
                <Circle className="absolute left-0 top-1.5 h-7 w-7 fill-[#0d131a] text-orange-500 stroke-[3]" />
                <div>
                  <span className="font-heading text-xl font-normal tracking-wide text-orange-500 block">
                    {item.time}
                  </span>
                  <h3 className="font-hand text-2xl font-bold text-white leading-tight">
                    {item.title}
                  </h3>
                  {item.badge && (
                    <div className="mt-2 inline-block rounded-md bg-orange-500/90 px-2.5 py-0.5 text-sm font-bold text-white shadow -rotate-2">
                      {item.badge}
                    </div>
                  )}
                  {item.note && (
                    <p className="font-hand mt-1 text-sm text-gray-400">{item.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}