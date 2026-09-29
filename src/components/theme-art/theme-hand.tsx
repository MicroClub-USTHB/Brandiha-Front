import type { SVGProps } from "react";

import { ThemeArt } from "@/components/theme-art/theme-gradient";

/**
 * The paint handprint the theme picker shows, in the current theme's colours —
 * or another theme's, inside an element carrying that `data-theme`. The shape
 * lives in `/theme-art/hand.svg`.
 */
export function ThemeHand(props: SVGProps<SVGSVGElement>) {
  return (
    <ThemeArt
      {...props}
      width={127}
      height={119}
      layers={[
        {
          href: "/theme-art/hand.svg#art",
          gradient: { x1: 29.7925, y1: -22.0328, x2: 132.13, y2: 65.035 },
          opacity: 0.68,
        },
      ]}
    />
  );
}
