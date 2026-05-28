// components/CustomCursor.tsx
"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * GTA 6-style custom cursor.
 *
 * - Replaces default OS cursor (cursor: none on body)
 * - Small green dot that follows mouse via quickTo (buttery smooth)
 * - Hovers over links/buttons → dot grows + ring expands
 * - Hovers over .proj-visual / [data-cursor="view"] → shows "VIEW" label
 * - Hovers over [data-cursor="drag"] → shows "DRAG"
 * - Works alongside CursorTrail (z-index: 10000, trail is 9999)
 * - Touch devices: auto-disabled, cursor:none not applied
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(hover: none)").matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    const label = labelRef.current;
    if (!dot || !ring || !label) return;

    // Hide default cursor globally
    document.body.style.cursor = "none";

    // quickTo for position — smoothest possible follow
    const xDot  = gsap.quickTo(dot,  "x", { duration: 0.15, ease: "power3.out" });
    const yDot  = gsap.quickTo(dot,  "y", { duration: 0.15, ease: "power3.out" });
    const xRing = gsap.quickTo(ring, "x", { duration: 0.45, ease: "power3.out" });
    const yRing = gsap.quickTo(ring, "y", { duration: 0.45, ease: "power3.out" });

    // ── Mouse move ──────────────────────────────────────────
    const onMove = (e: MouseEvent) => {
      xDot(e.clientX);
      yDot(e.clientY);
      xRing(e.clientX);
      yRing(e.clientY);
    };
    window.addEventListener("mousemove", onMove);

    // ── State helpers ────────────────────────────────────────
    const setState = (state: "default" | "hover" | "view" | "drag") => {
      switch (state) {
        case "default":
          gsap.to(dot,  { scale: 1,   opacity: 1,   duration: 0.3, ease: "power3.out" });
          gsap.to(ring, { scale: 1,   opacity: 0.5, duration: 0.4, ease: "power3.out" });
          gsap.to(label, { opacity: 0, scale: 0.8,  duration: 0.2 });
          break;

        case "hover":
          // Link/button — dot shrinks to a pin, ring expands
          gsap.to(dot,  { scale: 0.4, opacity: 1,   duration: 0.3, ease: "power3.out" });
          gsap.to(ring, { scale: 2.2, opacity: 0.8, duration: 0.4, ease: "power3.out" });
          gsap.to(label, { opacity: 0, scale: 0.8,  duration: 0.2 });
          break;

        case "view":
          // Project card — dot fills + VIEW label appears
          gsap.to(dot,  { scale: 4.5, opacity: 1,   duration: 0.5, ease: "expo.out" });
          gsap.to(ring, { scale: 0,   opacity: 0,   duration: 0.3 });
          gsap.to(label, { opacity: 1, scale: 1,    duration: 0.3, ease: "back.out(2)" });
          break;

        case "drag":
          gsap.to(dot,  { scale: 3.5, opacity: 1,   duration: 0.5, ease: "expo.out" });
          gsap.to(ring, { scale: 0,   opacity: 0,   duration: 0.3 });
          gsap.to(label, { opacity: 1, scale: 1,    duration: 0.3, ease: "back.out(2)" });
          break;
      }
    };

    // ── Delegation — single listener on document ─────────────
    const getState = (
      el: Element | null
    ): { state: "default" | "hover" | "view" | "drag"; text: string } => {
      if (!el) return { state: "default", text: "" };

      // Walk up max 6 levels to find a cursor target
      let node: Element | null = el;
      for (let i = 0; i < 6; i++) {
        if (!node) break;

        const cur = node.getAttribute("data-cursor");
        if (cur === "view") return { state: "view",  text: "VIEW" };
        if (cur === "drag") return { state: "drag",  text: "DRAG" };

        const tag = node.tagName.toLowerCase();
        if (
          tag === "a"     ||
          tag === "button"||
          node.classList.contains("proj-visual") ||
          node.classList.contains("link-underline") ||
          node.classList.contains("magnetic") ||
          node.getAttribute("role") === "button"
        ) {
          // Project visual card gets VIEW
          if (node.classList.contains("proj-visual")) {
            return { state: "view", text: "VIEW" };
          }
          return { state: "hover", text: "" };
        }

        node = node.parentElement;
      }
      return { state: "default", text: "" };
    };

    const onOver = (e: MouseEvent) => {
      const { state, text } = getState(e.target as Element);
      if (state === "view" || state === "drag") {
        label.textContent = text;
      }
      setState(state);
    };

    const onOut = (e: MouseEvent) => {
      // Only reset if leaving to outside a tracked element
      const related = e.relatedTarget as Element | null;
      const { state } = getState(related);
      if (state === "default") setState("default");
    };

    document.addEventListener("mouseover", onOver);
    document.addEventListener("mouseout",  onOut);

    // ── Click flash ──────────────────────────────────────────
    const onClick = () => {
      gsap.fromTo(
        ring,
        { scale: gsap.getProperty(ring, "scale") as number },
        { scale: (gsap.getProperty(ring, "scale") as number) + 0.8,
          opacity: 0,
          duration: 0.4,
          ease: "power2.out",
          onComplete: () => gsap.set(ring, { opacity: 0.5, scale: 1 }),
        }
      );
    };
    window.addEventListener("click", onClick);

    return () => {
      document.body.style.cursor = "";
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseover", onOver);
      document.removeEventListener("mouseout",  onOut);
      window.removeEventListener("click", onClick);
      gsap.killTweensOf([dot, ring, label]);
    };
  }, []);

  return (
    <>
      {/* Outer ring — lags behind cursor */}
      <div
        ref={ringRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 36,
          height: 36,
          borderRadius: "50%",
          border: "1.5px solid #00ff88",
          pointerEvents: "none",
          zIndex: 10000,
          transform: "translate(-50%, -50%)",
          opacity: 0.5,
          willChange: "transform",
        }}
      />

      {/* Inner dot — tight follow */}
      <div
        ref={dotRef}
        aria-hidden="true"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#00ff88",
          pointerEvents: "none",
          zIndex: 10000,
          transform: "translate(-50%, -50%)",
          willChange: "transform",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Label sits inside the dot (scales with it) */}
        <span
          ref={labelRef}
          aria-hidden="true"
          style={{
            position: "absolute",
            fontSize: "9px",
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: "0.15em",
            color: "#0a0a0a",
            whiteSpace: "nowrap",
            opacity: 0,
            userSelect: "none",
            pointerEvents: "none",
          }}
        >
          VIEW
        </span>
      </div>
    </>
  );
}