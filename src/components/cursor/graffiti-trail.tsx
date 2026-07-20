"use client";

import { useEffect, useRef } from "react";

/** How long (ms) a stretch of trail lingers before it has fully faded. */
const TRAIL_MS = 1000;
/** Stroke width (px) of a fresh trail; tapers as it fades. */
const LINE_WIDTH = 16;

interface Point {
  x: number;
  y: number;
  t: number;
}

/** Gradient stop positions, matching --primary-gradient in globals.css. */
const STOPS = [0.1107, 0.3147, 0.6811, 0.8494] as const;

/**
 * Stroke style for the trail: the theme's 4-stop brand gradient laid out along
 * the trail itself (tail -> head), so the whole stroke shows the full gradient.
 * Falls back to the theme's solid --primary when the --grad-* stops aren't
 * defined (non-default themes) or the trail is too short to span a gradient.
 */
function trailStroke(
  ctx: CanvasRenderingContext2D,
  root: HTMLElement,
  tail: Point,
  head: Point,
): string | CanvasGradient {
  const styles = getComputedStyle(root);
  const stops = STOPS.map((_, i) => styles.getPropertyValue(`--grad-${i + 1}`).trim());
  const solid = () => styles.getPropertyValue("--primary").trim() || "#000";
  if (stops.some((c) => !c)) return solid();
  if (tail.x === head.x && tail.y === head.y) return stops[stops.length - 1];

  const gradient = ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
  STOPS.forEach((offset, i) => gradient.addColorStop(offset, stops[i]));
  return gradient;
}

/**
 * Continuous graffiti trail painted onto a full-viewport canvas. Each point of
 * the mouse path is stroked in the theme's primary colour and fades out over
 * ~1s, so the trail reads as one continuous stroke that trails behind the
 * cursor. Canvas (not DOM nodes) so a fast-moving pointer can't bloat the DOM.
 */
export function GraffitiTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const root = document.documentElement;
    const points: Point[] = [];
    let dpr = 1;

    const resize = () => {
      dpr = Math.max(1, window.devicePixelRatio || 1);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };
    resize();

    const onMove = (e: MouseEvent) => {
      points.push({ x: e.clientX, y: e.clientY, t: performance.now() });
    };

    let raf = 0;
    const draw = () => {
      const now = performance.now();

      // Drop fully-faded points, keeping one past the cutoff for continuity.
      while (points.length > 1 && now - points[1].t > TRAIL_MS) points.shift();

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      if (points.length >= 2) {
        ctx.strokeStyle = trailStroke(ctx, root, points[0], points[points.length - 1]);
      }
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let i = 1; i < points.length; i++) {
        const a = points[i - 1];
        const b = points[i];
        const alpha = Math.max(0, 1 - (now - b.t) / TRAIL_MS);
        if (alpha <= 0) continue;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = LINE_WIDTH * (0.35 + 0.65 * alpha);
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("resize", resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="graffiti-trail" aria-hidden="true" />;
}
