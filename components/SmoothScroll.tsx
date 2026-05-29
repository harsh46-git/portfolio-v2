// components/SmoothScroll.tsx
"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * Lenis smooth scroll, synced with GSAP ScrollTrigger.
 *
 * The critical part: Lenis hijacks scrolling, so ScrollTrigger no longer
 * knows when the page scrolls. We must:
 *   1. Tell ScrollTrigger to ask Lenis for the scroll position (scrollerProxy)
 *   2. Run Lenis off GSAP's ticker (single RAF loop, perfect sync)
 *   3. Update ScrollTrigger on every Lenis scroll event
 *
 * Wrap your app with this once (in layout.tsx or page.tsx, near the top).
 */
export default function SmoothScroll({
  children,
}: {
  children?: React.ReactNode;
}) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Respect users who prefer reduced motion — skip smooth scroll
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;

    const lenis = new Lenis({
      duration: 1.6,                 // scroll inertia length (higher = floatier)
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // expo ease-out
      smoothWheel: true,
      wheelMultiplier: 0.8,          // slightly slower wheel = more premium feel
      touchMultiplier: 1.8,          // touch sensitivity
      lerp: 0.07,                    // lower = silkier/more buttery
    });

    // 1. Keep ScrollTrigger in sync on every Lenis scroll frame
    lenis.on("scroll", ScrollTrigger.update);

    // 2. Drive Lenis from GSAP's ticker so both share one RAF loop
    const raf = (time: number) => {
      // GSAP ticker time is in seconds, Lenis expects ms
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0); // disable lag smoothing for tight sync

    // 3. Recalculate triggers once everything is mounted
    ScrollTrigger.refresh();

    // Expose globally so other components (nav links, "back to top") can scroll
    // e.g. window.lenis.scrollTo("#contact")
    (window as any).lenis = lenis;

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      (window as any).lenis = null;
    };
  }, []);

  return <>{children}</>;
}