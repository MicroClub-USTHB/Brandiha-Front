"use client";

import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import { useGraffitiCursor } from "@/hooks/use-graffiti-cursor";
import { GraffitiTrail } from "./graffiti-trail";
import { SpraySplatter } from "./spray-splatter";

/**
 * Routes that keep the native cursor: the whole authenticated dashboard.
 *
 * It started as `/hr` alone, for the drag-and-drop there — but the ballot on
 * `/vote` drags too, and none of these pages is the graffiti wall the effect was
 * drawn for. A spray can trailing paint over a table of registrations is a
 * working tool wearing the wrong costume.
 *
 * Listed by hand rather than read from the route group, which `usePathname`
 * can't see. Deliberately not shared with the proxy's `PROTECTED_PREFIXES`
 * either, though the two happen to match today: "needs a session" and "is a
 * working tool, not a poster" are different questions, and a page can be the
 * second without being the first.
 */
const CURSOR_DISABLED_PREFIXES = ["/hr", "/submissions", "/vote"];

/**
 * Graffiti paint-splash cursor. Mounted once in the root layout. Renders via a
 * portal at the end of <body> so it sits above page content. Purely cosmetic:
 * it does not mount on touch devices or under `prefers-reduced-motion`, and
 * uses `pointer-events: none` so it never intercepts clicks.
 */
export function GraffitiCursor() {
  const pathname = usePathname();
  const disabled = CURSOR_DISABLED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const { enabled, cursorRef, hovering, splatters, removeSplatter } =
    useGraffitiCursor(disabled);

  // `enabled` only flips true inside a client effect, so by the time we render
  // the portal we're guaranteed to be on the client with `document.body` ready.
  if (!enabled) return null;

  return createPortal(
    <>
      {/* Continuous paint trail that fades over ~1s; paused over interactive
          elements so the pointer state leaves no trail. */}
      <GraffitiTrail paused={hovering} />

      {/* Hidden until the first real mouse move so it never flashes at (0,0). */}
      <div
        ref={cursorRef}
        className="graffiti-cursor"
        data-hover={hovering}
        style={{ opacity: 0 }}
      >
        <div className="graffiti-cursor__can" aria-hidden="true" />
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
