import type { SVGProps } from "react";

import { ThemeGradient, useGradientId } from "@/components/theme-art/theme-gradient";

/**
 * The paint handprint the theme picker shows, in the current theme's colours —
 * or another theme's, inside an element carrying that `data-theme`. The shape
 * lives in `/theme-art/hand.svg`.
 */
export function ThemeHand(props: SVGProps<SVGSVGElement>) {
  const id = useGradientId();
  return (
    <svg width={127} height={119} viewBox="0 0 127 119" fill="none" aria-hidden {...props}>
      <defs>
        <ThemeGradient id={id} x1={29.7925} y1={-22.0328} x2={132.13} y2={65.035} />
      </defs>
      <use href="/theme-art/hand.svg#art" fill={`url(#${id})`} opacity={0.68} />
    </svg>
  );
}
