import type { SVGProps } from "react";

import { ThemeArt } from "@/components/theme-art/theme-gradient";

/**
 * The painted frame behind the header's "Challenges" link, in the current
 * theme's colours: a rounded plate with a brush stroke over it. The shapes
 * live in `/theme-art/button.svg`.
 */
export function ButtonFrame(props: SVGProps<SVGSVGElement>) {
  return (
    <ThemeArt
      {...props}
      width={211}
      height={69}
      layers={[
        {
          href: "/theme-art/button.svg#frame",
          gradient: { x1: 4.47071, y1: 14.8171, x2: 176.146, y2: 55.3568 },
        },
        {
          href: "/theme-art/button.svg#brush",
          gradient: {
            x1: 6.21338,
            y1: 35,
            x2: 203.213,
            y2: 35,
            offsets: [0.13, 0.37, 0.79, 0.98],
          },
        },
      ]}
    />
  );
}
