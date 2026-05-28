"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const SKILLS = [
  "Next.js", "React", "TypeScript", "Node.js", "Python",
  "FastAPI", "PostgreSQL", "Prisma", "LangChain", "OpenAI",
  "Tailwind", "Docker", "AWS", "Redis", "Supabase",
  "Framer Motion", "GSAP", "AI/ML", "GenAI", "RAG",
];

export default function Marquee() {
  const track1Ref = useRef<HTMLDivElement>(null);
  const track2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tracks = [track1Ref.current, track2Ref.current];
    const baseSpeeds = [0.4, 0.28]; // px per frame at rest
    const xPositions = [0, 0];

    // Shared reactive state driven by scroll velocity
    const react = {
      speedMult: 1, // 1x at rest, boosts when scrolling fast
      skew: 0,      // skewX degrees, signed by scroll direction
    };

    // ── Main marquee ticker (now velocity-aware) ──
    const ticker = gsap.ticker.add(() => {
      tracks.forEach((track, i) => {
        if (!track) return;
        const direction = i === 0 ? -1 : 1;
        // speed scales with scroll velocity
        xPositions[i] += baseSpeeds[i] * react.speedMult * direction;
        const halfWidth = track.scrollWidth / 2;
        if (Math.abs(xPositions[i]) >= halfWidth) {
          xPositions[i] = 0;
        }
        // apply position + reactive skew (track2 skews opposite for depth)
        const skew = i === 0 ? react.skew : -react.skew;
        gsap.set(track, { x: xPositions[i], skewX: skew });
      });

      // Decay back to rest every frame (smooth settle when scroll stops)
      react.speedMult += (1 - react.speedMult) * 0.05;
      react.skew += (0 - react.skew) * 0.05;
    });

    // ── Read scroll velocity, feed the reactive state ──
    const st = ScrollTrigger.create({
      start: 0,
      end: "max",
      onUpdate: (self) => {
        const v = self.getVelocity(); // px/sec, signed

        // Speed: 1x rest → up to ~4x at high velocity
        const boost = 1 + Math.min(Math.abs(v) / 1200, 3);
        react.speedMult = Math.max(react.speedMult, boost);

        // Skew: ±6deg max, signed by direction
        const skewTarget = gsap.utils.clamp(-6, 6, v / 400);
        react.skew = skewTarget;
      },
    });

    return () => {
      gsap.ticker.remove(ticker);
      st.kill();
    };
  }, []);

  const doubled = [...SKILLS, ...SKILLS];

  return (
    <div className="relative overflow-hidden border-y border-white/[0.06] py-5 my-4">
      {/* Gradient fade edges */}
      <div
        className="pointer-events-none absolute inset-y-0 left-0 w-24 z-10"
        style={{ background: "linear-gradient(to right, var(--ink), transparent)" }}
      />
      <div
        className="pointer-events-none absolute inset-y-0 right-0 w-24 z-10"
        style={{ background: "linear-gradient(to left, var(--ink), transparent)" }}
      />

      {/* Track 1 — left to right */}
      <div
        ref={track1Ref}
        className="flex gap-10 mb-3 whitespace-nowrap w-max"
        style={{ willChange: "transform" }}
      >
        {doubled.map((skill, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="text-xs tracking-[0.3em] uppercase opacity-40 hover:opacity-100 hover:text-[--accent] transition-all duration-300 cursor-default">
              {skill}
            </span>
            <span className="text-[--accent] opacity-20 text-xs">◆</span>
          </span>
        ))}
      </div>

      {/* Track 2 — right to left (reverse) */}
      <div
        ref={track2Ref}
        className="flex gap-10 whitespace-nowrap w-max"
        style={{ willChange: "transform" }}
      >
        {[...doubled].reverse().map((skill, i) => (
          <span key={i} className="flex items-center gap-10">
            <span className="text-xs tracking-[0.3em] uppercase opacity-20 hover:opacity-80 hover:text-[--paper] transition-all duration-300 cursor-default">
              {skill}
            </span>
            <span className="text-white opacity-10 text-xs">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}