import { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type ActionButtonVariant = "primary" | "secondary";

/**
 * Each variant is a graffiti "splash": a PNG-masked coloured fill painted behind
 * the label. The label and any icon are passed as children, so the button stays
 * reusable — callers decide the text/icon, not the component.
 */
const VARIANTS: Record<
  ActionButtonVariant,
  { mask: string; fill: string; text: string }
> = {
  // `bg-primary` picks up the current --primary, so the primary button recolours
  // per step inside the registration form.
  primary: { mask: "/orange-button.png", fill: "bg-primary", text: "text-foreground" },
  secondary: { mask: "/black-button.png", fill: "bg-foreground", text: "text-background" },
};

export function ActionButton({
  variant = "primary",
  splash = false,
  className,
  children,
  ...props
}: ComponentProps<"button"> & {
  variant?: ActionButtonVariant;
  /** Render a graffiti paint-splatter bleeding out behind the button. */
  splash?: boolean;
}) {
  const { mask, fill, text } = VARIANTS[variant];

  return (
    <button
      className={cn(
        "relative isolate inline-flex h-14 items-center justify-center gap-2 overflow-visible px-8 font-sans text-base font-bold uppercase disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {/* Optional paint-splatter, larger than the box, bleeding out behind it. */}
      {splash && (
        <span
          aria-hidden
          className={cn(
            "next-splash-mask pointer-events-none absolute left-1/2 top-1/2 -z-20 size-40 translate-x-[calc(-50%+5px)] translate-y-[calc(-50%+15px)]",
            fill,
          )}
        />
      )}
      {/* Splash background, masked to the shape and scaled to bleed past the box. */}
      <span
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 -z-10 scale-110", fill)}
        style={{
          WebkitMaskImage: `url('${mask}')`,
          maskImage: `url('${mask}')`,
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      />
      <span className={cn("flex items-center gap-2", text)}>{children}</span>
    </button>
  );
}
