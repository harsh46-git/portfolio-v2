// components/FilmGrain.tsx
"use client";

import { useEffect, useRef } from "react";

/**
 * GTA 6-style animated film grain overlay.
 *
 * - Pure canvas, new noise every frame → feels alive (not static SVG)
 * - pointer-events: none → clicks pass through normally
 * - mixBlendMode: "overlay" → grain only shows on non-black areas (cinematic)
 * - Runs at 24fps (not 60) — intentional. Film grain is 24fps. 60fps grain
 *   looks like TV static. 24fps looks like cinema.
 * - Auto-pauses when tab is hidden (IntersectionObserver + visibilitychange)
 * - Respects prefers-reduced-motion
 */

interface FilmGrainProps {
  /** 0–1. How visible the grain is. Default 0.07 = subtle */
  opacity?: number;
  /** Grain particle size in pixels. Default 1 = fine grain */
  grainSize?: number;
  /** Playback fps. Default 24 = cinematic */
  fps?: number;
}

export default function FilmGrain({
  opacity = 0.07,
  grainSize = 1,
  fps = 24,
}: FilmGrainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect reduced-motion preference
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Skip on touch/mobile — grain barely visible, costs battery + CPU
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let imageData: ImageData | null = null;
    let raf = 0;
    let lastTime = 0;
    const interval = 1000 / fps;

    const resize = () => {
      // Use a downscaled canvas for perf — grain gets upscaled naturally
      // 0.3 scale = ~4x fewer pixels to fill each frame, imperceptible quality loss
      const scale = 0.3;
      width = Math.ceil(window.innerWidth * scale);
      height = Math.ceil(window.innerHeight * scale);
      canvas.width = width;
      canvas.height = height;
      // CSS size = full viewport
      canvas.style.width = "100vw";
      canvas.style.height = "100vh";
      // Pre-allocate imageData buffer once
      imageData = ctx.createImageData(width, height);
    };
    resize();
    window.addEventListener("resize", resize);

    const drawGrain = (timestamp: number) => {
      raf = requestAnimationFrame(drawGrain);

      // Throttle to target fps
      if (timestamp - lastTime < interval) return;
      lastTime = timestamp;

      if (!imageData) return;

      const data = imageData.data;
      const len = data.length;
      const grainPx = Math.max(1, Math.round(grainSize));

      // Fill pixel buffer with random luminance, full alpha
      // grainSize > 1: write same value to NxN block for chunkier grain
      if (grainPx === 1) {
        // Fast path — fine grain, fill every pixel independently
        for (let i = 0; i < len; i += 4) {
          const v = (Math.random() * 255) | 0;
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
          data[i + 3] = 255;
        }
      } else {
        // Chunky grain — fill blocks
        for (let y = 0; y < height; y += grainPx) {
          for (let x = 0; x < width; x += grainPx) {
            const v = (Math.random() * 255) | 0;
            for (let dy = 0; dy < grainPx && y + dy < height; dy++) {
              for (let dx = 0; dx < grainPx && x + dx < width; dx++) {
                const i = ((y + dy) * width + (x + dx)) * 4;
                data[i] = v;
                data[i + 1] = v;
                data[i + 2] = v;
                data[i + 3] = 255;
              }
            }
          }
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };

    // Pause when tab not visible — saves battery/CPU
    const onVisibility = () => {
      if (document.hidden) {
        cancelAnimationFrame(raf);
      } else {
        lastTime = 0;
        raf = requestAnimationFrame(drawGrain);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    raf = requestAnimationFrame(drawGrain);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [fps, grainSize]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9998,           // just below CursorTrail (9999)
        opacity,
        mixBlendMode: "overlay", // grain only visible on non-black surfaces
        imageRendering: "pixelated", // keep upscaled pixels crisp, not blurry
      }}
    />
  );
}