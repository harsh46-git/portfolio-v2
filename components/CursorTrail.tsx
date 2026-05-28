// components/CursorTrail.tsx
"use client";

import { useEffect, useRef } from "react";

/**
 * GTA 6-style glowing cursor trail.
 * - Canvas based (cheap, 60fps)
 * - Green glow matching portfolio theme
 * - pointer-events: none so clicks pass through normally
 * - Auto-disables on touch devices (no cursor there)
 */
export default function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // Skip on touch / no-hover devices
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ── Tunable config ──────────────────────────────
    const GLOW = "#1aff8c";        // theme green
    const TRAIL_LENGTH = 16;        // how many points in the tail
    const EASE = 0.22;              // how fast the lead point chases cursor (0-1)
    const CORE_RADIUS = 4;          // size of the leading dot
    const FADE = 0.86;              // tail width falloff per segment
    // ────────────────────────────────────────────────

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = width + "px";
      canvas.style.height = height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Mouse target + trail points
    const mouse = { x: width / 2, y: height / 2 };
    // Each point follows the one before it -> smooth elastic tail
    const points = Array.from({ length: TRAIL_LENGTH }, () => ({
      x: width / 2,
      y: height / 2,
    }));

    let isMoving = false;
    let idleTimer: ReturnType<typeof setTimeout>;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      isMoving = true;
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => (isMoving = false), 120);
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    const render = () => {
      raf = requestAnimationFrame(render);

      // Lead point chases the real cursor
      points[0].x += (mouse.x - points[0].x) * EASE;
      points[0].y += (mouse.y - points[0].y) * EASE;

      // Each following point chases the previous -> rope/tail effect
      for (let i = 1; i < points.length; i++) {
        points[i].x += (points[i - 1].x - points[i].x) * EASE;
        points[i].y += (points[i - 1].y - points[i].y) * EASE;
      }

      // Perf: if mouse is idle AND the tail has fully caught up to the head,
      // the trail is visually static — skip the expensive clear+shadow redraw.
      if (!isMoving) {
        const tail = points[points.length - 1];
        const head = points[0];
        const settled =
          Math.abs(tail.x - head.x) < 0.4 && Math.abs(tail.y - head.y) < 0.4;
        if (settled) return; // keep looping cheaply, but don't repaint
      }

      ctx.clearRect(0, 0, width, height);

      // ── Draw the glowing trail as a tapering line ──
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.shadowColor = GLOW;

      for (let i = 1; i < points.length; i++) {
        const t = 1 - i / points.length; // 1 at head, ~0 at tail
        const lineW = CORE_RADIUS * 2 * Math.pow(FADE, i);

        ctx.beginPath();
        ctx.moveTo(points[i - 1].x, points[i - 1].y);
        ctx.lineTo(points[i].x, points[i].y);
        ctx.strokeStyle = GLOW;
        ctx.globalAlpha = t * 0.55;
        ctx.shadowBlur = 14 * t;
        ctx.lineWidth = Math.max(lineW, 0.5);
        ctx.stroke();
      }

      // ── Bright core dot at the head ──
      ctx.globalAlpha = isMoving ? 1 : 0.7;
      ctx.shadowBlur = 22;
      ctx.beginPath();
      ctx.fillStyle = GLOW;
      ctx.arc(points[0].x, points[0].y, CORE_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      // Soft outer halo around the core
      ctx.globalAlpha = 0.18;
      ctx.shadowBlur = 36;
      ctx.beginPath();
      ctx.arc(points[0].x, points[0].y, CORE_RADIUS * 3, 0, Math.PI * 2);
      ctx.fill();

      // reset
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 0;
    };
    render();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      clearTimeout(idleTimer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none", // clicks pass through
        zIndex: 9999,
        mixBlendMode: "screen", // makes the glow pop on dark bg
      }}
    />
  );
}