"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Elements that should trigger the "about to spray" hover state. */
const HOVER_SELECTOR = 'a, button, [role="button"], .cursor-hover, [data-cursor="hover"]';

/** Number of splatter colour/shape variants (see `.graffiti-var-*` in globals.css). */
export const SPLATTER_VARIANTS = 3;

export interface Mark {
  id: number;
  x: number;
  y: number;
  variant: number;
}

interface GraffitiCursor {
  /** Whether the custom cursor should mount at all (desktop pointer, motion allowed). */
  enabled: boolean;
  /** Attach to the moving spray-can element; its transform is written directly per frame. */
  cursorRef: React.RefObject<HTMLDivElement | null>;
  hovering: boolean;
  splatters: Mark[];
  removeSplatter: (id: number) => void;
}

const randomVariant = () => Math.floor(Math.random() * SPLATTER_VARIANTS);

export function useGraffitiCursor(): GraffitiCursor {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [splatters, setSplatters] = useState<Mark[]>([]);

  const cursorRef = useRef<HTMLDivElement | null>(null);

  // Mutable per-frame state kept off React to avoid re-rendering on every move.
  const target = useRef({ x: 0, y: 0 });
  const rafId = useRef<number | null>(null);
  const hasMoved = useRef(false);
  const hoveringRef = useRef(false);
  const idSeq = useRef(0);

  // Decide whether to mount: pointer-capable device + motion not reduced.
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");

    const sync = () => setEnabled(fine.matches && !reduced.matches);
    sync();

    fine.addEventListener("change", sync);
    reduced.addEventListener("change", sync);
    return () => {
      fine.removeEventListener("change", sync);
      reduced.removeEventListener("change", sync);
    };
  }, []);

  const removeSplatter = useCallback((id: number) => {
    setSplatters((prev) => prev.filter((s) => s.id !== id));
  }, []);

  useEffect(() => {
    if (!enabled) return;

    document.documentElement.classList.add("graffiti-cursor-active");

    const applyFrame = () => {
      rafId.current = null;
      const node = cursorRef.current;
      if (!node) return;
      const { x, y } = target.current;
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (hasMoved.current) node.style.opacity = "1";
    };

    const scheduleFrame = () => {
      if (rafId.current == null) rafId.current = requestAnimationFrame(applyFrame);
    };

    const handleMove = (e: MouseEvent) => {
      target.current = { x: e.clientX, y: e.clientY };
      hasMoved.current = true;
      scheduleFrame();

      // Hover state — only re-render when the boolean actually flips.
      const over = !!(e.target as Element | null)?.closest?.(HOVER_SELECTOR);
      if (over !== hoveringRef.current) {
        hoveringRef.current = over;
        setHovering(over);
      }
    };

    const spawnSplat = () => {
      const splat: Mark = {
        id: idSeq.current++,
        x: target.current.x + (Math.random() - 0.5) * 16,
        y: target.current.y + (Math.random() - 0.5) * 16,
        variant: randomVariant(),
      };
      setSplatters((prev) => [...prev, splat]);
    };

    let sprayInterval: ReturnType<typeof setInterval> | null = null;

    const handleDown = () => {
      spawnSplat();
      sprayInterval = setInterval(spawnSplat, 50);
    };

    const handleUp = () => {
      if (sprayInterval !== null) {
        clearInterval(sprayInterval);
        sprayInterval = null;
      }
    };

    // Hide the can when the pointer leaves the window, reveal on return.
    const handleOut = (e: MouseEvent) => {
      if (!e.relatedTarget && cursorRef.current) cursorRef.current.style.opacity = "0";
    };
    const handleOver = () => {
      if (hasMoved.current && cursorRef.current) cursorRef.current.style.opacity = "1";
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mousedown", handleDown);
    window.addEventListener("mouseup", handleUp);
    document.addEventListener("mouseout", handleOut);
    document.addEventListener("mouseover", handleOver);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mousedown", handleDown);
      window.removeEventListener("mouseup", handleUp);
      document.removeEventListener("mouseout", handleOut);
      document.removeEventListener("mouseover", handleOver);
      if (sprayInterval !== null) clearInterval(sprayInterval);
      if (rafId.current != null) cancelAnimationFrame(rafId.current);
      rafId.current = null;
      document.documentElement.classList.remove("graffiti-cursor-active");
      // Reset so a re-enable (e.g. toggling reduced-motion) starts clean.
      hasMoved.current = false;
      hoveringRef.current = false;
      setHovering(false);
      setSplatters([]);
    };
  }, [enabled]);

  return {
    enabled,
    cursorRef,
    hovering,
    splatters,
    removeSplatter,
  };
}
