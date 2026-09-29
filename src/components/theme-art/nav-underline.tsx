import type { SVGProps } from "react";

import { ThemeArt } from "@/components/theme-art/theme-gradient";

/**
 * The brush stroke under the active nav link, in the current theme's colours.
 * The shape lives in `/theme-art/nav-underline.svg`; only its fill is set here.
 */
export function NavUnderline(props: SVGProps<SVGSVGElement>) {
  return (
    <ThemeArt
      {...props}
      width={72}
      height={16}
      layers={[
        {
          href: "/theme-art/nav-underline.svg#art",
          gradient: { x1: -0.636914, y1: 1.78989, x2: 60.7744, y2: 19.0154 },
        },
      ]}
    />
  );
}
