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
      {/* Optional paint-splatter. It spans the button's full width (inset-x-0)
          and shares the same centre + scale as the fill below, so the horizontal
          brand gradient flows continuously across both instead of restarting
          inside the splatter. The `contain` mask keeps the blob's shape/size,
          centred in this wider box. Sits above the fill (-z-20) but below the
          text (auto). */}
      {splash && (
        <span
          aria-hidden
          className={cn(
            // The splatter SVG art sits high-left in its canvas, so it needs
            // re-centring. Vertical is done with a transform (not mask-position):
            // `contain` leaves no vertical slack, so a Y mask-position offset
            // would push the blob past the box and clip it — moving the whole
            // box is safe (mask stays centred) and, since the gradient is
            // horizontal, a vertical shift keeps continuity with the fill.
            "pointer-events-none absolute inset-x-0 -inset-y-10 -z-10 translate-y-4 scale-110",
            fill,
          )}
          style={{
            WebkitMaskImage: "url('/next-button-splash.svg')",
            maskImage: "url('/next-button-splash.svg')",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            // Horizontal re-centre. Safe on this axis: the box is far wider than
            // the blob, so there's slack to shift without clipping (unlike Y).
            WebkitMaskPosition: "calc(50% + 5px) center",
            maskPosition: "calc(50% + 5px) center",
          }}
        />
      )}
      {/* Button fill, masked to the shape and scaled to bleed past the box. */}
      <span
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 -z-20 scale-110", fill)}
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
