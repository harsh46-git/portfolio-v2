// components/CinematicIntro.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";

/**
 * GTA 6-style cinematic page-load intro.
 *
 * Sequence:
 *   1. Full black screen
 *   2. Horizontal scanline sweeps top -> bottom
 *   3. Loading counter ticks 00 -> 100
 *   4. Overlay splits into bars + wipes away (reveal site)
 *   5. Hero text slams in: blur -> sharp + scale settle
 *
 * Runs ONCE per browser session (sessionStorage). Refresh in a NEW
 * tab / after closing = plays again; soft reload = skipped.
 *
 * IMPORTANT: your hero must have:
 *   <h1 className="hero-name">HARSH</h1>   (or whatever heading)
 * The intro targets `.hero-name`, `.hero-avatar`, `.hero-tags`, `.hero-bio`.
 */
export default function CinematicIntro() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const scanRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const barsRef = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Skip if already played this session
    if (sessionStorage.getItem("introPlayed")) {
      setShow(false);
      return;
    }

    // Lock scroll during intro
    document.body.style.overflow = "hidden";

    const counterObj = { val: 0 };
    const bars = barsRef.current?.querySelectorAll(".intro-bar");

    // Set initial hero state (hidden + blurred) so it can slam in
    gsap.set([".hero-name", ".hero-avatar"], {
      opacity: 0,
      filter: "blur(24px)",
      scale: 1.15,
      y: 40,
    });
    gsap.set([".hero-tags", ".hero-bio"], { opacity: 0, y: 30 });

    const tl = gsap.timeline({
      defaults: { ease: "power3.out" },
      onComplete: () => {
        sessionStorage.setItem("introPlayed", "1");
        document.body.style.overflow = "";
        setShow(false);
      },
    });

    // 1. Scanline sweep down
    tl.fromTo(
      scanRef.current,
      { top: "-2%", opacity: 0 },
      { top: "102%", opacity: 1, duration: 1.1, ease: "power2.inOut" }
    )
      .to(scanRef.current, { opacity: 0, duration: 0.2 }, "-=0.15")

      // 2. Counter ticks 0 -> 100
      .to(
        counterObj,
        {
          val: 100,
          duration: 1.4,
          ease: "power1.inOut",
          onUpdate: () => {
            if (counterRef.current) {
              counterRef.current.textContent = String(
                Math.round(counterObj.val)
              ).padStart(3, "0");
            }
          },
        },
        "-=0.9"
      )

      // 3. Counter + label fade out
      .to(".intro-meta", { opacity: 0, y: -20, duration: 0.4 }, "+=0.1")

      // 4. Bars wipe away to reveal site (alternating directions)
      .to(
        bars ? Array.from(bars) : [],
        {
          scaleY: 0,
          duration: 0.9,
          ease: "expo.inOut",
          stagger: { each: 0.06, from: "center" },
          transformOrigin: (i: number) =>
            i % 2 === 0 ? "top center" : "bottom center",
        },
        "-=0.1"
      )

      // 5. Hero name SLAMS in: blur -> sharp
      .to(
        ".hero-name",
        {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          y: 0,
          duration: 1.1,
          ease: "expo.out",
        },
        "-=0.5"
      )
      .to(
        ".hero-avatar",
        {
          opacity: 1,
          filter: "blur(0px)",
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: "expo.out",
        },
        "-=0.9"
      )
      .to(
        [".hero-tags", ".hero-bio"],
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 },
        "-=0.7"
      );

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);

  if (!show) return null;

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 99999,
        pointerEvents: "none",
      }}
    >
      {/* Wipe bars (these are the actual black cover) */}
      <div
        ref={barsRef}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
        }}
      >
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="intro-bar"
            style={{
              flex: 1,
              background: "#0a0a0a",
              transformOrigin: "center",
            }}
          />
        ))}
      </div>

      {/* Scanline */}
      <div
        ref={scanRef}
        style={{
          position: "absolute",
          left: 0,
          width: "100%",
          height: "2px",
          background: "#1aff8c",
          boxShadow: "0 0 18px 2px #1aff8c, 0 0 40px 4px rgba(26,255,140,0.4)",
          top: "-2%",
        }}
      />

      {/* Counter + label */}
      <div
        className="intro-meta"
        style={{
          position: "absolute",
          bottom: "8%",
          left: "6%",
          fontFamily: "monospace",
          color: "#fff",
        }}
      >
        <div
          style={{
            fontSize: "11px",
            letterSpacing: "0.3em",
            color: "#1aff8c",
            marginBottom: "8px",
            textTransform: "uppercase",
          }}
        >
          Loading Portfolio
        </div>
        <div style={{ fontSize: "clamp(48px, 10vw, 120px)", fontWeight: 700, lineHeight: 1 }}>
          <span ref={counterRef}>000</span>
          <span style={{ fontSize: "0.4em", color: "#1aff8c" }}>%</span>
        </div>
      </div>

      {/* Top + bottom corner ticks (GTA HUD vibe) */}
      <div
        className="intro-meta"
        style={{
          position: "absolute",
          top: "6%",
          right: "6%",
          fontFamily: "monospace",
          fontSize: "11px",
          letterSpacing: "0.25em",
          color: "rgba(255,255,255,0.6)",
        }}
      >
        PORTFOLIO · 2026
      </div>
    </div>
  );
}