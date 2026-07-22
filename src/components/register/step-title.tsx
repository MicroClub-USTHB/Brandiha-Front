import Image from "next/image";
import { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Gradient fill used to accent parts of a step title. */
const GRADIENT_STYLE: CSSProperties = {
  backgroundImage: "linear-gradient(to right, var(--grad-1), var(--grad-2))",
  WebkitBackgroundClip: "text",
  WebkitTextFillColor: "transparent",
};

/** Shared heading shell so every step title has the same size/weight/spacing. */
function TitleShell({ children }: { children: ReactNode }) {
  return (
    <h2 className={cn("text-center text-[clamp(1.75rem,min(4.2vw,6vh),3.75rem)] font-extrabold uppercase tracking-wide font-heading")}>
      {children}
    </h2>
  );
}

/** A plain (foreground) title word. */
function Word({ children }: { children: ReactNode }) {
  return <span className="text-foreground tracking-[0.1em]">{children}</span>;
}

/** A gradient-accented title word. */
function Accent({ children }: { children: ReactNode }) {
  return <span style={GRADIENT_STYLE}>{children}</span>;
}

export function RegistrationsTitle() {
  return (
    <TitleShell>
      <Accent>Brandiha</Accent>{" "}
      <span className={cn("relative text-foreground tracking-[0.1em]")}>
        Registrations
        {/* Anchored to the word: tweak alignment via the absolute offsets below. */}
        <Image
          src="/underline-stroke.png"
          alt=""
          width={300}
          height={50}
          aria-hidden
          className={cn("pointer-events-none absolute left-0 top-full w-full object-contain")}
        />
      </span>
    </TitleShell>
  );
}

export function PortfolioMotivationTitle() {
  return (
    <TitleShell>
      <Word>Portfolio</Word> <Accent>&</Accent> <Word>Motivation</Word>
    </TitleShell>
  );
}

export function AvailabilityTitle() {
  return (
    <TitleShell>
      <Word>Availability</Word>
    </TitleShell>
  );
}
