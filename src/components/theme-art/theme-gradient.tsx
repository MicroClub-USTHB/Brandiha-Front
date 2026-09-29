import { useId } from "react";

/** The Gekko's stop offsets, which the theme art was drawn with too. */
const GEKKO_OFFSETS = [0.129808, 0.365385, 0.788462, 0.982854] as const;

/**
 * An id unique to this render, safe inside `url(#…)`. Each piece of theme art
 * needs its own gradient: a stop resolves its colour where the gradient sits
 * in the DOM, not where it's used, so two instances sharing one id would both
 * paint with whichever theme wrapped the first — which breaks the theme
 * picker's per-theme previews.
 */
export function useGradientId() {
  return `theme-art-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;
}

/**
 * The chameleon gradient every piece of theme art is painted with, the same
 * trick as the Gekko (`gekko.tsx`): each stop reads `--gekko-n`, which only
 * the chameleon theme defines, and falls back to `--primary` everywhere else —
 * so the art is the four-colour gradient in chameleon and the theme's solid
 * colour in every other theme, with no JavaScript deciding which.
 *
 * Coordinates are in the art's own user space, copied from its source SVG.
 */
export function ThemeGradient({
  id,
  x1,
  y1,
  x2,
  y2,
  offsets = GEKKO_OFFSETS,
}: {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  offsets?: readonly [number, number, number, number];
}) {
  return (
    <linearGradient id={id} x1={x1} y1={y1} x2={x2} y2={y2} gradientUnits="userSpaceOnUse">
      {offsets.map((offset, i) => (
        <stop key={i} offset={offset} stopColor={`var(--gekko-${i + 1}, var(--primary))`} />
      ))}
    </linearGradient>
  );
}
