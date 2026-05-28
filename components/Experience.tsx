"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const EXPERIENCE = [
  {
    date: "2025",
    role: "Generative AI Intern",
    org: "Google Cloud · SmartBridge / SmartInternz",
    bullets: [
      "Built a domain-specific Q&A application using Google Cloud Vertex AI and Gemini APIs with Retrieval-Augmented Generation (RAG).",
      "Designed and benchmarked 15+ prompt engineering workflows, improving response relevance by ~30%.",
      "Deployed on Google Cloud Run with structured logging and evaluation pipelines.",
    ],
  },
  {
    date: "2023",
    role: "Social Intern",
    org: "Navjeevan Educational & Social Welfare Society",
    bullets: [
      "Applied data-driven strategies to support outreach initiatives.",
      "Improved operational efficiency through structured reporting.",
    ],
  },
];

const SKILLS = [
  { cat: "Languages", items: ["C", "C++", "Python", "JavaScript", "TypeScript", "SQL"] },
  { cat: "Frameworks", items: ["Next.js", "React", "Node.js", "FastAPI", "Flask", "Tailwind"] },
  { cat: "AI / ML", items: ["LLMs", "Prompt Engineering", "RAG", "TensorFlow", "OpenCV"] },
  { cat: "Cloud", items: ["Vercel", "GCP", "Vertex AI", "Supabase", "Groq Cloud"] },
];

export default function Experience() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading reveal
      gsap.fromTo(
        ".exp-heading",
        { opacity: 0, y: 60 },
        {
          opacity: 1, y: 0, duration: 1, ease: "power3.out",
          scrollTrigger: { trigger: ".exp-heading", start: "top 85%" },
        }
      );

      // Experience rows — same timing as your Framer delay: idx * 0.1
      gsap.utils.toArray<HTMLElement>(".exp-row").forEach((row, i) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 30 },
          {
            opacity: 1, y: 0, duration: 0.6, ease: "power3.out",
            delay: i * 0.1,
            scrollTrigger: { trigger: row, start: "top 88%", end: "bottom 15%", toggleActions: "play reverse play reverse" },
          }
        );
      });

      // Skill categories stagger
      gsap.fromTo(
        ".skill-cat",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.6, ease: "power2.out", stagger: 0.12,
          scrollTrigger: { trigger: ".skill-cat", start: "top 88%", end: "bottom 15%", toggleActions: "play reverse play reverse" },
        }
      );

      // Skill tags pop in with scale
      gsap.utils.toArray<HTMLElement>(".skill-tag").forEach((tag, i) => {
        gsap.fromTo(
          tag,
          { opacity: 0, scale: 0.85 },
          {
            opacity: 1, scale: 1, duration: 0.4, ease: "back.out(1.5)",
            delay: i * 0.03,
            scrollTrigger: { trigger: tag, start: "top 92%", end: "bottom 15%", toggleActions: "play reverse play reverse" },
          }
        );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="experience"
      className="py-32 px-6 sm:px-10 border-t border-white/10"
    >
      <div className="max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-20">

        {/* Section label + heading */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          <div className="lg:col-span-3">
            <div className="text-xs tracking-[0.3em] uppercase text-white/40">
              (03) — Experience
            </div>
          </div>
          <div className="lg:col-span-9">
            <h2 className="exp-heading display text-5xl sm:text-7xl lg:text-8xl leading-[0.95]">
              Where I've
              <br />
              <span className="text-accent">worked.</span>
            </h2>
          </div>
        </div>

        {/* Experience rows — motion.div replaced with plain div + GSAP class */}
        <div className="space-y-8 mb-24">
          {EXPERIENCE.map((e, idx) => (
            <div
              key={idx}
              className="exp-row grid grid-cols-1 md:grid-cols-12 gap-6 py-8 border-t border-white/10 hover:border-accent/50 transition-colors group"
            >
              <div className="md:col-span-2 text-sm tracking-widest text-white/40">
                {e.date}
              </div>
              <div className="md:col-span-4">
                <h3 className="display text-2xl sm:text-3xl text-paper group-hover:text-accent transition-colors">
                  {e.role}
                </h3>
                <div className="text-sm text-white/50 mt-1">{e.org}</div>
              </div>
              <ul className="md:col-span-6 space-y-2 text-sm text-white/70">
                {e.bullets.map((b, i) => (
                  <li key={i} className="flex gap-3">
                    <span className="text-accent shrink-0">—</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Skills */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12">
          <div className="lg:col-span-3">
            <div className="text-xs tracking-[0.3em] uppercase text-white/40">
              Stack
            </div>
          </div>
          <div className="lg:col-span-9 grid grid-cols-1 sm:grid-cols-2 gap-8">
            {SKILLS.map((s) => (
              <div key={s.cat} className="skill-cat">
                <div className="text-xs tracking-widest uppercase text-accent mb-3">
                  {s.cat}
                </div>
                <div className="flex flex-wrap gap-2">
                  {s.items.map((item) => (
                    <span
                      key={item}
                      className="skill-tag text-sm border border-white/20 px-3 py-1 hover:border-accent hover:text-accent transition-colors"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}