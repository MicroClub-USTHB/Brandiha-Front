import Image from "next/image";
import { Section } from "@/components/landing/section";
import { CountdownTimer } from "@/components/landing/countdown-timer";

const targetDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

export function Hero() {
  return (
    <Section
      as="section"
      className="relative flex flex-col items-center justify-between w-full max-w-none px-0 pt-48 pb-32 min-h-[95svh]"
    >
      <div className="relative z-10 flex flex-col items-center gap-6">
        <Image
          src="/primary-logo.png"
          alt="Brandiha"
          width={620}
          height={153}
          priority
        />
        <div className="flex flex-col items-center gap-4">
          <p className="font-heading text-5xl font-semibold tracking-wide text-white uppercase">
            Brand ur way out!
          </p>
          <a
            href="#register"
            className="inline-flex h-10 items-center my-6 justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            Register
          </a>
        </div>
      </div>
      <div className="relative z-10 flex flex-col items-center gap-6">
        <CountdownTimer targetDate={targetDate} />
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <svg
              className="text-primary"
              width={28}
              height={28}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="font-hand text-lg text-white/70">Location TBD</span>
          </div>
          <div className="flex items-center gap-2">
            <svg
              className="text-primary"
              width={28}
              height={28}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 6v6l4 2" />
            </svg>
            <span className="font-hand text-lg text-white/70">Date TBD</span>
          </div>
        </div>
      </div>
    </Section>
  );
}
