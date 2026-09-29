import type { SVGProps } from "react";

/**
 * The Brandiha wordmark: a dark shadow, with letters in the current theme's
 * colour — white in chameleon, which sets `--logo-letters`, and `--primary` in
 * every other theme. The shape lives in `/theme-art/logo.svg`, whose shadow
 * paths keep their own fill; only the letters take this one.
 */
export function BrandLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width={253} height={63} viewBox="0 0 253 63" fill="none" role="img" aria-label="Brandiha" {...props}>
      <use href="/theme-art/logo.svg#art" style={{ fill: "var(--logo-letters, var(--primary))" }} />
    </svg>
  );
}
