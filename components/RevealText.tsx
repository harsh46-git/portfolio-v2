"use client";

import { useEffect, useRef, ReactNode, ElementType } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
  duration?: number;
  className?: string;
  as?: ElementType;
};

export default function Reveal({
  children,
  delay = 0,
  y = 60,
  duration = 1.1,
  className = "",
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const Tag = as as any;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect users who prefer reduced motion
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      gsap.set(el, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        el,
        { opacity: 0, y, filter: "blur(8px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration,
          delay,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            end: "bottom 12%",
            // play (enter) / reverse (leave) / play (enter back) / reverse (leave back)
            // → element re-animates whenever it scrolls into view from either direction
            toggleActions: "play reverse play reverse",
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [delay, y, duration]);

  return (
    <Tag ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </Tag>
  );
}
