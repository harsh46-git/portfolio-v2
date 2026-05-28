
"use client";

import { useEffect, useRef, ReactNode, ElementType } from "react";
import { gsap } from "@/lib/gsap";

interface MagneticProps {
  children: ReactNode;
  strength?: number;
  textStrength?: number;
  padding?: number;
  className?: string;
  as?: ElementType;
}

/**
 * GTA 6-style magnetic button.
 * Wrap ANY element — it physically attracts toward the cursor on hover,
 * then elastically snaps back on mouseout.
 *
 * Usage:
 *   <Magnetic>
 *     <a href="mailto:..." className="...">EMAIL ME</a>
 *   </Magnetic>
 *
 *   <Magnetic strength={0.5}>
 *     <button>View Live</button>
 *   </Magnetic>
 *
 * Auto-disables on touch devices.
 */
export default function Magnetic({
  children,
  strength = 0.4,
  textStrength = 0.25,
  padding = 0,
  className = "",
  as = "div",
}: MagneticProps) {
  const wrapRef = useRef<HTMLElement>(null);
  const innerRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // No magnetism on touch / no-hover devices
    if (window.matchMedia("(hover: none)").matches) return;

    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;

    const xToWrap = gsap.quickTo(wrap, "x", { duration: 0.5, ease: "power3.out" });
    const yToWrap = gsap.quickTo(wrap, "y", { duration: 0.5, ease: "power3.out" });
    const xToInner = gsap.quickTo(inner, "x", { duration: 0.6, ease: "power3.out" });
    const yToInner = gsap.quickTo(inner, "y", { duration: 0.6, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      const rect = wrap.getBoundingClientRect();
      // distance of cursor from element center
      const relX = e.clientX - (rect.left + rect.width / 2);
      const relY = e.clientY - (rect.top + rect.height / 2);

      xToWrap(relX * strength);
      yToWrap(relY * strength);
      xToInner(relX * textStrength);
      yToInner(relY * textStrength);
    };

    const onLeave = () => {
      // Elastic snap back to origin
      gsap.to(wrap, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.4)",
      });
      gsap.to(inner, {
        x: 0,
        y: 0,
        duration: 0.8,
        ease: "elastic.out(1, 0.35)",
      });
    };

    wrap.addEventListener("mousemove", onMove);
    wrap.addEventListener("mouseleave", onLeave);

    return () => {
      wrap.removeEventListener("mousemove", onMove);
      wrap.removeEventListener("mouseleave", onLeave);
      gsap.killTweensOf([wrap, inner]);
    };
  }, [strength, textStrength]);

  const Tag = as as any;

  return (
    <Tag
      ref={wrapRef}
      className={className}
      style={{
        display: "inline-block",
        position: "relative",
        // padding expands the magnetic hover field without changing layout look
        padding: padding ? `${padding}px` : undefined,
        margin: padding ? `-${padding}px` : undefined,
        willChange: "transform",
      }}
    >
      <span
        ref={innerRef}
        style={{ display: "inline-block", willChange: "transform" }}
      >
        {children}
      </span>
    </Tag>
  );
}
