import { cn } from "@/lib/utils";
import type { Mark } from "@/hooks/use-graffiti-cursor";

/** Three blob arrangements, chosen per burst for visual variety. */
const SPLATTER_VARIANTS: ReadonlyArray<ReadonlyArray<[number, number, number]>> = [
  [
    [32, 32, 12],
    [16, 20, 5],
    [48, 18, 6],
    [50, 46, 4.5],
    [18, 46, 5],
    [32, 12, 3],
    [52, 32, 3.5],
    [32, 54, 3],
  ],
  [
    [32, 30, 11],
    [14, 34, 6],
    [50, 24, 6.5],
    [40, 50, 5],
    [22, 14, 4],
    [54, 42, 3],
    [12, 18, 3],
    [30, 55, 2.5],
  ],
  [
    [30, 34, 13],
    [48, 40, 5.5],
    [18, 22, 5.5],
    [42, 14, 4.5],
    [10, 40, 3.5],
    [55, 28, 3],
    [26, 55, 3],
    [36, 10, 2.5],
  ],
];

interface SpraySplatterProps {
  mark: Mark;
  /** Base class controlling animation + z-index (`graffiti-splatter` or `graffiti-drip`). */
  className: string;
  onDone: (id: number) => void;
}

/** A single paint-splatter burst. Removes itself once its animation finishes. */
export function SpraySplatter({ mark, className, onDone }: SpraySplatterProps) {
  const blobs = SPLATTER_VARIANTS[mark.variant % SPLATTER_VARIANTS.length];

  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn(className, `graffiti-var-${mark.variant % SPLATTER_VARIANTS.length}`)}
      style={{ left: mark.x, top: mark.y }}
      onAnimationEnd={() => onDone(mark.id)}
    >
      {blobs.map(([cx, cy, r], i) => (
        <circle key={i} cx={cx} cy={cy} r={r} />
      ))}
    </svg>
  );
}
