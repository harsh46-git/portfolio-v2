// lib/gsap.ts
// Centralized GSAP setup — import this wherever you need GSAP
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TextPlugin } from "gsap/TextPlugin";
 
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, TextPlugin);
}
 
export { gsap, ScrollTrigger, TextPlugin };
 
// Shared ease presets
export const EASE_OUT = "power3.out";
export const EASE_INOUT = "power2.inOut";
export const EASE_ELASTIC = "elastic.out(1, 0.5)";
 
// Stagger reveal utility
export function revealFrom(
  targets: gsap.TweenTarget,
  from: gsap.TweenVars = {},
  to: gsap.TweenVars = {}
) {
  return gsap.fromTo(
    targets,
    { opacity: 0, y: 50, ...from },
    { opacity: 1, y: 0, duration: 1, ease: EASE_OUT, ...to }
  );
}
 
// ScrollTrigger batch reveal
export function batchReveal(targets: string, options: ScrollTrigger.BatchVars = {}) {
  return ScrollTrigger.batch(targets, {
    onEnter: (els) =>
      gsap.fromTo(
        els,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: EASE_OUT,
          stagger: 0.12,
        }
      ),
    start: "top 88%",
    ...options,
  });
}