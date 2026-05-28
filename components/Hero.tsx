"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      // ── HARSH letters: cinematic mask reveal ──
      const nameEl = sectionRef.current?.querySelector(".hero-name");
      if (nameEl) {
        // Alternate solid / outline letters for visual rhythm: H A R S H
        const letters = "HARSH".split("");
        nameEl.innerHTML = letters
          .map((c, i) => {
            // outline the A and S (index 1 and 3) for contrast
            const isOutline = i === 1 || i === 3;
            const cls = isOutline ? "letter-inner outline-text" : "letter-inner";
            return (
              `<span class="letter-mask" style="display:inline-block;overflow:hidden;vertical-align:bottom;">` +
              `<span class="${cls}" style="display:inline-block;will-change:transform;">${c}</span>` +
              `</span>`
            );
          })
          .join("");

        tl.fromTo(
          nameEl.querySelectorAll(".letter-inner"),
          { yPercent: 120, rotate: 8, filter: "blur(12px)", opacity: 0 },
          {
            yPercent: 0,
            rotate: 0,
            filter: "blur(0px)",
            opacity: 1,
            duration: 1.2,
            ease: "expo.out",
            stagger: 0.1,
          },
          0.1
        );
      }

      // ── Glow fades in behind HARSH ──
      tl.fromTo(
        ".hero-glow",
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 1.6, ease: "expo.out" },
        0.2
      );

      // ── Subtitle ──
      tl.fromTo(
        ".hero-sub",
        { opacity: 0, y: 30, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 0.9 },
        0.7
      );

      // ── Tags ──
      tl.fromTo(
        ".hero-tags > *",
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.05 },
        0.9
      );

      // ── Bio ──
      tl.fromTo(
        ".hero-bio",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6 },
        1.05
      );

      // ── Corner meta + scroll cue ──
      tl.fromTo(
        [".hero-scroll", ".hero-stats", ".hero-corner"],
        { opacity: 0 },
        { opacity: 1, duration: 0.8, stagger: 0.08 },
        1.3
      );

      // ── Bouncing scroll arrow (continuous) ──
      gsap.to(".scroll-dot", {
        y: 8,
        duration: 1,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2,
      });

      // ── Slow glow pulse (continuous) ──
      gsap.to(".hero-glow", {
        opacity: 0.7,
        scale: 1.1,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: 2,
      });

      // ── HARSH parallax + fade on scroll (single merged trigger) ──
      gsap.to(".hero-name", {
        yPercent: 30,
        opacity: 0.25,
        scale: 0.97,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.8,
        },
      });

      // ── Everything fades out on scroll (starts later, gentler) ──
      gsap.to([".hero-tags", ".hero-bio", ".hero-scroll", ".hero-stats"], {
        opacity: 0,
        y: -40,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "30% top",
          end: "70% top",
          scrub: 0.6,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Mobile: address bar show/hide changes viewport height — refresh ScrollTrigger
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener("orientationchange", refresh);
    return () => window.removeEventListener("orientationchange", refresh);
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-screen flex flex-col items-center justify-center px-6 overflow-hidden"
    >
      {/* Radial glow behind HARSH */}
      <div
        className="hero-glow absolute pointer-events-none"
        style={{
          width: "70vw",
          height: "70vw",
          maxWidth: "900px",
          maxHeight: "900px",
          background:
            "radial-gradient(circle, rgba(0,255,136,0.12) 0%, rgba(0,255,136,0.04) 35%, transparent 70%)",
          filter: "blur(40px)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Slow-drifting secondary glow — pure CSS, GPU-accelerated, living background */}
      <div
        className="hero-aurora absolute pointer-events-none"
        aria-hidden="true"
        style={{
          width: "90vw",
          height: "90vw",
          maxWidth: "1100px",
          maxHeight: "1100px",
          background:
            "radial-gradient(ellipse at 40% 40%, rgba(0,255,136,0.07) 0%, transparent 60%)",
          filter: "blur(60px)",
          top: "50%",
          left: "50%",
        }}
      />

      <style jsx>{`
        .hero-aurora {
          transform: translate(-50%, -50%);
          will-change: transform;
          animation: aurora-drift 18s ease-in-out infinite;
        }
        @keyframes aurora-drift {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) scale(1);
          }
          33% {
            transform: translate(-46%, -54%) rotate(8deg) scale(1.08);
          }
          66% {
            transform: translate(-54%, -47%) rotate(-6deg) scale(0.96);
          }
          100% {
            transform: translate(-50%, -50%) rotate(0deg) scale(1);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .hero-aurora {
            animation: none;
          }
        }
      `}</style>

      {/* Top corner meta */}
      <div className="hero-corner absolute top-28 left-6 sm:left-10 text-xs tracking-[0.3em] uppercase text-white/50">
        ◉ Available for full-time roles
      </div>
      <div className="hero-corner absolute top-28 right-6 sm:right-10 text-xs tracking-[0.3em] uppercase text-white/50 text-right">
        India<br />UTC+5:30
      </div>

      {/* Center stage */}
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-[1400px]">

        {/* Massive HARSH */}
        <h1 className="hero-name display text-[26vw] sm:text-[24vw] lg:text-[21vw] text-paper leading-[0.82] w-full">
          HARSH
        </h1>

        {/* Tagline */}
        <div className="hero-sub flex items-center gap-3 text-xs sm:text-sm tracking-[0.4em] uppercase text-white/60 mt-4">
          <span className="inline-block w-10 h-px bg-white/30" />
          Full Stack · AI Engineer
          <span className="inline-block w-10 h-px bg-white/30" />
        </div>

        {/* Tags */}
        <div className="hero-tags mt-8 flex flex-wrap gap-3 sm:gap-4 items-center justify-center text-xs sm:text-sm tracking-[0.3em] uppercase text-white/70">
          <span>Next.js</span>
          <span className="text-accent">◆</span>
          <span>GenAI</span>
          <span className="text-accent">◆</span>
          <span>RAG</span>
          <span className="text-accent">◆</span>
          <span>LLMs</span>
        </div>

        {/* One-line bio */}
        <p className="hero-bio mt-8 max-w-xl text-white/55 text-sm sm:text-base leading-relaxed">
          B.Tech CSE (AI/ML) · UPES Dehradun · Class of 2026. Currently shipping{" "}
          <a
            href="https://www.monexi.in"
            target="_blank"
            rel="noreferrer"
            className="text-accent link-underline"
          >
            monexi.in
          </a>
          {" "}— an AI-powered personal finance platform.
        </p>
      </div>

      {/* Bottom scroll cue — animated */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs tracking-[0.3em] uppercase text-white/40">
        <span>Scroll</span>
        <span className="flex items-start justify-center w-5 h-8 border border-white/20 rounded-full pt-1.5">
          <span className="scroll-dot inline-block w-1 h-1.5 bg-accent rounded-full" />
        </span>
      </div>

      <div className="hero-stats absolute bottom-8 right-6 sm:right-10 text-xs tracking-[0.2em] uppercase text-right text-white/40">
        <div>3 production projects</div>
        <div>1 live SaaS · monexi.in</div>
      </div>
    </section>
  );
}
