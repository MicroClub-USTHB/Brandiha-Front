import Image from "next/image";
import type { FormEventHandler, ReactNode } from "react";

/**
 * The single-column form on a paper card, headed by the chameleon logo and a
 * title — the shell the login and challenge-submission forms share. The fields,
 * errors, and actions go in as children.
 */
export function PaperFormCard({
  title,
  subtitle,
  onSubmit,
  children,
}: {
  title: string;
  /** A small line under the title, e.g. which challenge this submits to. */
  subtitle?: ReactNode;
  onSubmit: FormEventHandler<HTMLFormElement>;
  children: ReactNode;
}) {
  return (
    <div className="relative mx-auto flex w-full max-w-md flex-col items-center px-4 overflow-visible">
      <form
        onSubmit={onSubmit}
        className="flex w-full flex-col gap-[clamp(1.5rem,4vh,2.5rem)] overflow-visible border-0 bg-paper px-[clamp(1.5rem,7vw,3.5rem)] pt-[clamp(2rem,6vh,4rem)] pb-[clamp(2.5rem,7vh,5rem)] text-card-foreground font-sans"
      >
        <div className="flex flex-col items-center gap-[clamp(0.75rem,2vh,1.5rem)]">
          <div className="relative w-[clamp(7rem,18vh,11rem)] h-[clamp(7rem,18vh,11rem)]">
            <Image
              src="/chameleon-logo.png"
              alt="Chameleon logo"
              width={256}
              height={256}
              className="w-full h-full object-contain pointer-events-none"
            />
          </div>
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-center text-[clamp(1.75rem,min(4.2vw,6vh),3.75rem)] font-extrabold uppercase tracking-wide font-heading text-foreground">
              {title}
            </h2>
            {subtitle && (
              <p className="text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground font-sans">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {children}
      </form>
    </div>
  );
}
