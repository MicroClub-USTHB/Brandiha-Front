import Image from "next/image";
import { Section } from "@/components/landing/section";
import { DecorativeSvg, BackgroundDecoration } from "@/components/landing/decorative-svg";
import { CountdownTimer } from "@/components/landing/countdown-timer";

const heroDecorations = [
  "compound-path-17",
  "compound-path-18",
  "vector",
  "design",
  "marketing",
  "multi",
  "comm",
  "bshhhhh",
] as const;

const targetDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000);

export function Hero() {
  return (
    <Section
      as="section"
      className="relative flex flex-col items-center justify-start bg-cover bg-center bg-repeat w-full max-w-none px-0 -translate-y-[20%]"
      style={{ height: 1024 }}
    >
      <BackgroundDecoration
        name="wall-background"
        className="absolute inset-0 bg-cover bg-center bg-repeat"
      />
      <div className="relative z-10 mt-[25%] flex flex-col items-center gap-6">
        <Image
          src="/primary-logo.png"
          alt="Brandiha"
          width={893}
          height={220}
          priority
        />
        <div className="flex flex-col items-center gap-4">
          <p className="font-mono text-2xl font-semibold tracking-wide text-white uppercase">
            Brand ur way out!
          </p>
          <a
            href="#register"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            Register
          </a>
        </div>
        <CountdownTimer targetDate={targetDate} />
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/70">Location TBD</span>
            <Image src="/map-pin.svg" alt="" width={20} height={20} />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/70">Date TBD</span>
            <Image src="/clock.svg" alt="" width={20} height={20} />
          </div>
        </div>
      </div>
      {heroDecorations.map((name) => (
        <DecorativeSvg key={name} name={name} />
      ))}
    </Section>
  );
}
