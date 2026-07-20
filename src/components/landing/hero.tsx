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
      <div className="relative z-10 mt-[30%] flex flex-col items-center gap-6">
        <Image
          src="/primary-logo.png"
          alt="Brandiha"
          width={893}
          height={220}
          priority
        />
        <p className="font-mono text-2xl font-semibold tracking-wide text-white uppercase">
          Brand ur way out!
        </p>
        <CountdownTimer targetDate={targetDate} />
      </div>
      {heroDecorations.map((name) => (
        <DecorativeSvg key={name} name={name} />
      ))}
    </Section>
  );
}
