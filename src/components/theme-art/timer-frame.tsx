import type { SVGProps } from "react";

import { ThemeGradient, useGradientId } from "@/components/theme-art/theme-gradient";

/**
 * The painted plate behind the countdown and the leaderboard scores, in the
 * current theme's colours. The shape lives in `/theme-art/timer.svg`.
 */
export function TimerFrame(props: SVGProps<SVGSVGElement>) {
  const id = useGradientId();
  return (
    <svg width={1185} height={403} viewBox="0 0 1185 403" fill="none" aria-hidden {...props}>
      <defs>
        <ThemeGradient id={id} x1={-10.4826} y1={45.0829} x2={1044.33} y2={238.413} />
      </defs>
      <use href="/theme-art/timer.svg#art" fill={`url(#${id})`} />
    </svg>
  );
}
