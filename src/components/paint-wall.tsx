"use client";

import { useEffect, useRef } from "react";

const MIN_R = 8;
const MAX_R = 20;

function themeColors(): string[] {
  const styles = getComputedStyle(document.documentElement);
  const c1 = styles.getPropertyValue("--grad-1").trim();
  const c2 = styles.getPropertyValue("--grad-2").trim();
  const c3 = styles.getPropertyValue("--grad-3").trim();
  const c4 = styles.getPropertyValue("--grad-4").trim();
  if (c1 && c2 && c3 && c4) return [c1, c2, c3, c4];
  const p = styles.getPropertyValue("--primary").trim();
  const c2b = styles.getPropertyValue("--chart-2").trim();
  const c4b = styles.getPropertyValue("--chart-4").trim();
  return [p || "#fff", c2b || p || "#fff", c4b || p || "#fff", p || "#fff"];
}

export function PaintWall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const palette = useRef<string[]>([]);

  useEffect(() => {
    palette.current = themeColors();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      ctx.canvas.width = window.innerWidth;
      ctx.canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const observer = new MutationObserver(() => {
      palette.current = themeColors();
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });

    return () => {
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  const color = () => palette.current[Math.floor(Math.random() * palette.current.length)];

  const r = () => MIN_R + Math.random() * (MAX_R - MIN_R);

  const drawSegment = (x1: number, y1: number, x2: number, y2: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const c = color();
    const radius = r();
    const steps = Math.max(Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 6), 1);

    const j = () => (Math.random() - 0.5) * radius * 0.3;

    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = x1 + (x2 - x1) * t;
      const y = y1 + (y2 - y1) * t;

      ctx.beginPath();
      ctx.arc(x + j(), y + j(), radius, 0, Math.PI * 2);
      ctx.fillStyle = c;
      ctx.globalAlpha = 0.18;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, radius * 0.55, 0, Math.PI * 2);
      ctx.fillStyle = c;
      ctx.globalAlpha = 0.35;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, radius * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.globalAlpha = 0.3;
      ctx.fill();
    }

    ctx.globalAlpha = 1;
  };

  const isOverInteractive = (e: React.PointerEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return false;
    canvas.style.pointerEvents = "none";
    const el = document.elementFromPoint(e.clientX, e.clientY);
    canvas.style.pointerEvents = "auto";
    return !!el?.closest("a, button, [role=button], input, select, textarea, [data-no-paint]");
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isOverInteractive(e)) return;

    drawing.current = true;
    last.current = { x: e.clientX, y: e.clientY };
    drawSegment(e.clientX, e.clientY, e.clientX, e.clientY);
    canvasRef.current?.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!drawing.current || !last.current) return;
    drawSegment(last.current.x, last.current.y, e.clientX, e.clientY);
    last.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = () => {
    drawing.current = false;
    last.current = null;
  };

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
    />
  );
}
