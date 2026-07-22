import { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import SvgBackButton from "@/components/register/buttons/BackButton";
import SvgNextButton from "@/components/register/buttons/NextButton";

const BUTTON =
  "block shrink-0 overflow-visible disabled:pointer-events-none disabled:opacity-50";
const SVG = "block h-full w-auto";

export function BackNavButton({ className, ...props }: ComponentProps<"button">) {
  return (
    <button type="button" className={cn(BUTTON, className)} {...props}>
      <SvgBackButton className={SVG} />
    </button>
  );
}

export function NextNavButton({ className, ...props }: ComponentProps<"button">) {
  return (
    // `text-primary` → currentColor → the step's accent hue (set via --primary),
    // so one SVG recolors per step instead of shipping a variant per color.
    <button className={cn(BUTTON, "text-primary", className)} {...props}>
      {/* Crop the viewBox to the button core (y 55..133 of the 219-tall canvas)
          so it sizes like the Back button; the splash overflows via overflow-visible. */}
      <SvgNextButton viewBox="0 55 217 78" className={cn(SVG, "overflow-visible")} />
    </button>
  );
}
