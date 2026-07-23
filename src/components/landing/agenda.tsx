import { Section } from "@/components/landing/section";
import { CustomCard } from "@/components/ui/custom-card";
import { BRANDIHA_AGENDA_DATA } from "@/lib/agenda-data";

export function Agenda() {
  return (
    <Section as="section" id="agenda" className="w-full py-16">
      <div className="mx-auto max-w-[1500px] px-6">
        <div className="text-center mb-16">
          <h2 className="font-heading text-6xl md:text-8xl font-black uppercase tracking-wider text-white drop-shadow-[0_6px_6px_rgba(0,0,0,0.6)]">
            BRANDIHA AGENDA
          </h2>
        </div>

        <div className="grid grid-cols-1 items-center justify-items-center gap-y-14 sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-4 lg:gap-x-44">
          {BRANDIHA_AGENDA_DATA.map((card, index) => (
            <CustomCard key={index} card={card} />
          ))}
        </div>
      </div>
    </Section>
  );
}