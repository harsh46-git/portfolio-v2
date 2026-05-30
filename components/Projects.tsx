// components/Projects.tsx
"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ArrowUpRight } from "lucide-react";
import Magnetic from "@/components/Magnetic";

type Project = {
  number: string;
  title: string;
  tag: string;
  date: string;
  status: "Live" | "GitHub" | "Archived";
  showOverlay?: boolean;
  description: string;
  stack: string[];
  bullets: string[];
  liveUrl?: string;
  repoUrl: string;
  image: string;
};

const PROJECTS: Project[] = [
  {
    number: "01",
    title: "Monexi",
    tag: "AI-Powered Personal Finance Platform",
    date: "Jan 2026 — May 2026",
    status: "Live",
    description:
      "A live AI finance platform serving real users. Solo built end-to-end with Next.js 16, React 19, TypeScript. The core feature: a PDF bank statement analyzer that uses Llama 3.3 70B on Groq Cloud to auto-categorize spending, compute savings rate, and generate personalized insights.",
    stack: ["Next.js 16", "React 19", "TypeScript", "Llama 3.3", "Groq", "Supabase", "Vercel"],
    bullets: [
      "PDF bank statement analyzer — extracts via unpdf, analyzes via Llama 3.3 70B",
      "Conversational AI advisor grounded in Indian financial context",
      "Real-time equity quotes via Yahoo Finance + Amadeus flight/hotel pricing",
      "Email-OTP auth, Postgres-backed plan storage, FY 2024-25 tax calculator",
    ],
    liveUrl: "https://www.monexi.in",
    repoUrl: "https://github.com/harsh46-git/v0-monexi-css",
    showOverlay: true,
    image: "/projects/monexi.png",
  },
  {
    number: "02",
    title: "HueHive",
    tag: "AI Virtual Wardrobe",
    date: "Jan 2025 — May 2025",
    status: "Live",
    description:
      "Computer-vision powered outfit recommender. Analyzes color harmony, occasion suitability, and style coherence. 1000+ clothing images processed with automated tagging.",
    stack: ["Python", "OpenCV", "TensorFlow", "Flask", "HSV color space"],
    bullets: [
      "AI outfit recommendation using HSV color matching + rule-based logic",
      "1000+ clothing images automatically tagged and indexed",
      "Sub-2s inference per recommendation, deployed as interactive web app",
    ],
    liveUrl: "https://sxdarksoul.github.io/huehive/",
    repoUrl: "https://github.com/harsh46-git/Huehive",
    image: "/projects/huehive.png",
  },
  {
    number: "03",
    title: "Supply Chain Path Optimizer",
    tag: "Algorithmic Optimization in C",
    date: "Aug 2024 — Dec 2024",
    status: "GitHub",
    description:
      "Pure C implementation of a route optimizer for logistics networks. Dijkstra for shortest paths, TSP heuristic for multi-stop tours. 200+ node network. Pointer-heavy adjacency-list under the hood.",
    stack: ["C", "Graph algorithms", "Dijkstra", "TSP heuristics"],
    bullets: [
      "Adjacency-list graph representation for 200+ node networks",
      "Dijkstra for inter-hub shortest paths, TSP for multi-stop tours",
      "Coursework project — taught me complexity-first thinking",
    ],
    repoUrl: "https://github.com/harsh46-git/Supply-chain-path-optimizer",
    image: "/projects/supply-chain.png",
  },
];

export default function Projects() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Heading wipe ──
      gsap.fromTo(
        ".projects-heading",
        { clipPath: "inset(0 100% 0 0)" },
        {
          clipPath: "inset(0 0% 0 0)",
          duration: 1.3,
          ease: "expo.out",
          scrollTrigger: { trigger: ".projects-heading", start: "top 82%", end: "bottom 15%", toggleActions: "play reverse play reverse" },
        }
      );

      // ── Each block ──
      gsap.utils.toArray<HTMLElement>(".project-block").forEach((block, i) => {
        const fromLeft = i % 2 === 0;

        // Visual slides in from side — stronger distance
        gsap.fromTo(
          block.querySelector(".proj-visual"),
          { x: fromLeft ? -180 : 180, opacity: 0, scale: 0.88, filter: "blur(8px)" },
          {
            x: 0, opacity: 1, scale: 1, filter: "blur(0px)",
            duration: 1.2, ease: "expo.out",
            scrollTrigger: { trigger: block, start: "top 85%", end: "bottom 10%", toggleActions: "play reverse play reverse" },
          }
        );

        // Content slides from opposite side
        gsap.fromTo(
          block.querySelector(".proj-content"),
          { x: fromLeft ? 120 : -120, opacity: 0, y: 30 },
          {
            x: 0, opacity: 1, y: 0,
            duration: 1.2, ease: "expo.out", delay: 0.12,
            scrollTrigger: { trigger: block, start: "top 85%", end: "bottom 10%", toggleActions: "play reverse play reverse" },
          }
        );

        // Number — subtle, hidden on mobile
        gsap.fromTo(
          block.querySelector(".proj-number"),
          { scale: 1.8, opacity: 0 },
          {
            scale: 1, opacity: 0.03,
            duration: 1.6, ease: "expo.out",
            scrollTrigger: { trigger: block, start: "top 88%", end: "bottom 10%", toggleActions: "play reverse play reverse" },
          }
        );

        // Bullets stagger up
        gsap.fromTo(
          block.querySelectorAll(".proj-bullet"),
          { y: 20, opacity: 0 },
          {
            y: 0, opacity: 1,
            duration: 0.5, ease: "power3.out", stagger: 0.08, delay: 0.3,
            scrollTrigger: { trigger: block, start: "top 82%", end: "bottom 10%", toggleActions: "play reverse play reverse" },
          }
        );

        // Tags pop in
        gsap.fromTo(
          block.querySelectorAll(".proj-tag"),
          { scale: 0.75, opacity: 0, y: 12 },
          {
            scale: 1, opacity: 1, y: 0,
            duration: 0.35, ease: "back.out(2)", stagger: 0.04, delay: 0.4,
            scrollTrigger: { trigger: block, start: "top 82%", end: "bottom 10%", toggleActions: "play reverse play reverse" },
          }
        );
      });
    }, sectionRef);

    // ── Lightweight 3D tilt (transform only, no WebGL) ──
    if (typeof window === "undefined") return () => ctx.revert();
    if (window.matchMedia("(hover: none)").matches) return () => ctx.revert();

    const cards = sectionRef.current?.querySelectorAll<HTMLElement>(".proj-visual");
    const cleanups: (() => void)[] = [];

    cards?.forEach((card) => {
      const inner = card.querySelector("a") as HTMLElement | null;
      if (!inner) return;
      card.style.perspective = "900px";
      inner.style.transformStyle = "preserve-3d";

      const xTo = gsap.quickTo(inner, "rotationY", { duration: 0.5, ease: "power3.out" });
      const yTo = gsap.quickTo(inner, "rotationX", { duration: 0.5, ease: "power3.out" });

      const onMove = (e: MouseEvent) => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        xTo(px * 10);
        yTo(-py * 6);
      };
      const onLeave = () => {
        gsap.to(inner, { rotationX: 0, rotationY: 0, duration: 0.7, ease: "elastic.out(1, 0.4)" });
      };

      card.addEventListener("mousemove", onMove);
      card.addEventListener("mouseleave", onLeave);
      cleanups.push(() => {
        card.removeEventListener("mousemove", onMove);
        card.removeEventListener("mouseleave", onLeave);
        gsap.killTweensOf(inner);
      });
    });

    return () => {
      ctx.revert();
      cleanups.forEach((fn) => fn());
    };
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="py-24 sm:py-32 px-6 sm:px-12 lg:px-20">
      <div className="max-w-[1800px] mx-auto">

        {/* Header */}
        <div className="mb-16 sm:mb-20">
          <div className="text-xs tracking-[0.3em] uppercase text-white/40 mb-4">
            (02) — Selected Work
          </div>
          <div className="overflow-hidden">
            <h2 className="projects-heading display text-5xl sm:text-7xl lg:text-8xl leading-[0.95]">
              Things I've{" "}
              <span className="outline-text">shipped.</span>
            </h2>
          </div>
        </div>

        {/* Blocks */}
        <div className="space-y-16 sm:space-y-20">
          {PROJECTS.map((p) => (
            <div key={p.number} className="project-block group relative pt-8">

              <span className="proj-number absolute top-0 left-0 display text-[6rem] sm:text-[9rem] leading-none text-white pointer-events-none select-none opacity-0 hidden sm:block">
                {p.number}
              </span>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 relative z-10 items-start">

                {/* ── Visual ── */}
                <div className="proj-visual">
                  <a
                    href={p.liveUrl || p.repoUrl}
                    target="_blank"
                    rel="noreferrer"
                    data-cursor="view"
                    className="block relative aspect-[16/10] border border-white/10 overflow-hidden bg-[#0c0c0c]"
                  >
                    {/* Static image with CSS zoom on hover — fast, no WebGL */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.image}
                      alt={p.title}
                      loading="lazy"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 flex flex-col justify-between p-6 sm:p-8 z-10">
                      <div className="flex justify-between items-start">
                        <span className="text-xs tracking-[0.3em] uppercase text-white/70">
                          / {p.number}
                        </span>
                        <span
                          className={`text-xs tracking-widest uppercase px-3 py-1 border backdrop-blur-sm ${
                            p.status === "Live"
                              ? "border-accent text-accent bg-black/40"
                              : "border-white/40 text-white/70 bg-black/40"
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                      <div className="bg-gradient-to-t from-black/85 via-black/30 to-transparent -mx-6 sm:-mx-8 -mb-6 sm:-mb-8 px-6 sm:px-8 pb-6 sm:pb-8 pt-16">
                        {p.showOverlay && (
                          <div className="display text-4xl sm:text-6xl text-paper leading-none">
                            {p.title}
                          </div>
                        )}
                        <div className="mt-2 text-xs tracking-widest uppercase text-white/60">
                          {p.date}
                        </div>
                      </div>
                    </div>

                    <ArrowUpRight
                      size={28}
                      className="absolute top-6 right-6 sm:top-8 sm:right-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500 z-20 text-white"
                    />
                  </a>
                </div>

                {/* ── Content ── */}
                <div className="proj-content flex flex-col">
                  <div className="text-xs tracking-[0.3em] uppercase text-white/40 mb-3">
                    {p.tag}
                  </div>
                  <h3 className="display text-3xl sm:text-5xl mb-5 text-paper">{p.title}</h3>
                  <p className="text-white/70 text-sm sm:text-lg leading-relaxed mb-6 max-w-2xl">
                    {p.description}
                  </p>

                  <ul className="space-y-2 mb-6 max-w-2xl">
                    {p.bullets.map((b, i) => (
                      <li key={i} className="proj-bullet flex gap-3 text-sm text-white/60">
                        <span className="text-accent shrink-0">▸</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-2 mb-8">
                    {p.stack.map((s) => (
                      <span
                        key={s}
                        className="proj-tag text-xs uppercase tracking-wider border border-white/20 px-3 py-1 text-white/70 hover:border-accent hover:text-accent transition-colors"
                      >
                        {s}
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-6 text-sm">
                    {p.liveUrl && (
                      <Magnetic strength={0.4} padding={8}>
                        <a
                          href={p.liveUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="link-underline inline-flex items-center gap-2 text-accent"
                        >
                          View Live <ArrowUpRight size={16} />
                        </a>
                      </Magnetic>
                    )}
                    <Magnetic strength={0.4} padding={8}>
                      <a
                        href={p.repoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="link-underline inline-flex items-center gap-2 text-paper"
                      >
                        Source <ArrowUpRight size={16} />
                      </a>
                    </Magnetic>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}