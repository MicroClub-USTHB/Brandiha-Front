import type { SVGProps } from "react";

import { ThemeGradient, useGradientId } from "@/components/theme-art/theme-gradient";

/**
 * The painted frame behind the header's "Challenges" link, in the current
 * theme's colours: a rounded plate with a brush stroke over it. The shapes
 * live in `/theme-art/button.svg`.
 */
export function ButtonFrame(props: SVGProps<SVGSVGElement>) {
  const frame = useGradientId();
  const brush = useGradientId();
  return (
    <svg width={211} height={69} viewBox="0 0 211 69" fill="none" aria-hidden {...props}>
      <defs>
        <ThemeGradient id={frame} x1={4.47071} y1={14.8171} x2={176.146} y2={55.3568} />
        <ThemeGradient
          id={brush}
          x1={6.21338}
          y1={35}
          x2={203.213}
          y2={35}
          offsets={[0.13, 0.37, 0.79, 0.98]}
        />
      </defs>
      <use href="/theme-art/button.svg#frame" fill={`url(#${frame})`} />
      <use href="/theme-art/button.svg#brush" fill={`url(#${brush})`} />
    </svg>
  );
}
