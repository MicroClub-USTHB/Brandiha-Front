import Image from "next/image";
import { Section } from "@/components/landing/section";
import { CountdownTimer } from "@/components/landing/countdown-timer";

const targetDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

export function Hero() {
  return (
    <Section
      as="section"
      className="relative flex min-h-screen w-full max-w-none flex-col items-center justify-center overflow-hidden px-4 py-28 sm:px-6 sm:py-32"
    >
      <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-5 sm:gap-6 lg:gap-8">
        <Image
          src="/primary-logo.svg"
          alt="Brandiha"
          width={620}
          height={153}
          priority
          className="h-auto w-[min(84vw,38rem)] sm:w-[min(72vw,42rem)] lg:w-155 2xl:w-200"
        />
        <CountdownTimer targetDate={targetDate} />
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="font-heading text-2xl font-semibold tracking-wide text-white uppercase sm:text-3xl">
            one virage away from your brand !
          </p>
        </div>
      </div>
    </Section>
  );
}
