"use client";

import { createPortal } from "react-dom";
import { useGraffitiCursor } from "@/hooks/use-graffiti-cursor";
import { CursorSplash } from "./cursor-splash";
import { GraffitiTrail } from "./graffiti-trail";
import { SpraySplatter } from "./spray-splatter";

/**
 * Graffiti paint-splash cursor. Mounted once in the root layout. Renders via a
 * portal at the end of <body> so it sits above page content. Purely cosmetic:
 * it does not mount on touch devices or under `prefers-reduced-motion`, and
 * uses `pointer-events: none` so it never intercepts clicks.
 */
export function GraffitiCursor() {
  const { enabled, cursorRef, hovering, splatters, removeSplatter } = useGraffitiCursor();

  // `enabled` only flips true inside a client effect, so by the time we render
  // the portal we're guaranteed to be on the client with `document.body` ready.
  if (!enabled) return null;

  return createPortal(
    <>
      {/* Continuous paint trail that fades over ~1s, painted under the cursor. */}
      <GraffitiTrail />

      {/* Hidden until the first real mouse move so it never flashes at (0,0). */}
      <div
        ref={cursorRef}
        className="graffiti-cursor"
        data-hover={hovering}
        style={{ opacity: 0 }}
      >
        <div className="graffiti-cursor__splash">
          <CursorSplash />
        </div>
      </div>

      {splatters.map((splatter) => (
        <SpraySplatter
          key={splatter.id}
          mark={splatter}
          className="graffiti-splatter"
          onDone={removeSplatter}
        />
      ))}
    </>,
    document.body,
  );
}
