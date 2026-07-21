import Image from "next/image";
import { Section } from "@/components/landing/section";

export function Hero() {
  return (
    <Section
      as="section"
      className="relative flex flex-col items-center justify-center w-full max-w-none px-0 pt-48 pb-32 min-h-screen"
    >
      <div className="relative z-10 flex flex-col items-center gap-6">
        <Image
          src="/primary-logo.svg"
          alt="Brandiha"
          width={620}
          height={153}
          priority
          className="2xl:w-200 2xl:h-50"
        />
        <div className="flex flex-col items-center gap-4">
          <p className="font-heading text-3xl font-semibold tracking-wide text-white uppercase">
            one virage away from your brand !
          </p>
        </div>
      </div>
    </Section>
  );
}
