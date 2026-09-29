import type { SVGProps } from "react";

import { ThemeArt } from "@/components/theme-art/theme-gradient";

/**
 * The painted plate behind the countdown and the leaderboard scores, in the
 * current theme's colours. The shape lives in `/theme-art/timer.svg`.
 */
export function TimerFrame(props: SVGProps<SVGSVGElement>) {
  return (
    <ThemeArt
      {...props}
      width={1185}
      height={403}
      layers={[
        {
          href: "/theme-art/timer.svg#art",
          gradient: { x1: -10.4826, y1: 45.0829, x2: 1044.33, y2: 238.413 },
        },
      ]}
    />
  );
}
