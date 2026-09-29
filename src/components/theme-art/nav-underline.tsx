import type { SVGProps } from "react";

import { ThemeGradient, useGradientId } from "@/components/theme-art/theme-gradient";

/**
 * The brush stroke under the active nav link, in the current theme's colours.
 * The shape lives in `/theme-art/nav-underline.svg`; only its fill is set here.
 */
export function NavUnderline(props: SVGProps<SVGSVGElement>) {
  const id = useGradientId();
  return (
    <svg width={72} height={16} viewBox="0 0 72 16" fill="none" aria-hidden {...props}>
      <defs>
        <ThemeGradient id={id} x1={-0.636914} y1={1.78989} x2={60.7744} y2={19.0154} />
      </defs>
      <use href="/theme-art/nav-underline.svg#art" fill={`url(#${id})`} />
    </svg>
  );
}
