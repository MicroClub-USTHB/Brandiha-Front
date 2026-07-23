import Image from "next/image";
import { Section } from "@/components/landing/section";
import { CountdownTimer } from "@/components/landing/countdown-timer";

const targetDate = new Date(2026, 6, 25, 22, 30, 0, 0);

export function Hero() {
  return (
    <Section
      as="section"
      className="relative flex min-h-screen w-full max-w-none flex-col items-center justify-center overflow-hidden px-[5%] py-[12vh]"
    >
      <div className="relative z-10 flex w-[90%] max-w-5xl flex-col items-center gap-[3vh]">
        <Image
          src="/primary-logo.svg"
          alt="Brandiha"
          width={620}
          height={153}
          draggable={false}
          priority
          className="h-auto w-full lg:w-[55%] 2xl:w-[85%] max-w-200"
        />
        <CountdownTimer targetDate={targetDate} />
        <div className="flex w-full flex-col items-center gap-[2vh] text-center">
          <p className="font-heading text-[clamp(1.25rem,4vw,2rem)] font-semibold tracking-wide text-white uppercase">
            one virage away from your brand !
          </p>
        </div>
      </div>
    </Section>
  );
}
