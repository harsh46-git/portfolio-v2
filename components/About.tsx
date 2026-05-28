"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

const STATS = [
  { value: 1, suffix: "", label: "Live SaaS Product", prefix: "" },
  { value: 3, suffix: "+", label: "Production Projects", prefix: "" },
  { value: 2, suffix: "+", label: "Internships", prefix: "" },
  { value: 5, suffix: "+", label: "Certifications", prefix: "" },
];

export default function About() {
  const sectionRef = useRef<HTMLElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      // ── Heading reveal (stronger: bigger travel + blur + dramatic ease)
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, x: -100, filter: "blur(10px)" },
        {
          opacity: 1, x: 0, filter: "blur(0px)", duration: 1.3, ease: "expo.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // ── Text paragraphs (stronger staggered fade-up)
      gsap.fromTo(
        ".about-para",
        { opacity: 0, y: 50, filter: "blur(6px)" },
        {
          opacity: 1, y: 0, filter: "blur(0px)",
          duration: 1, ease: "power3.out", stagger: 0.15,
          scrollTrigger: {
            trigger: textRef.current,
            start: "top 85%",
            end: "bottom 15%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // ── Stat boxes cascade (stronger: full card slides up + scales)
      gsap.fromTo(
        statsRef.current?.children || [],
        { y: 60, opacity: 0, scale: 0.9, filter: "blur(8px)" },
        {
          y: 0, opacity: 1, scale: 1, filter: "blur(0px)",
          duration: 0.9, ease: "expo.out", stagger: 0.12,
          scrollTrigger: {
            trigger: statsRef.current,
            start: "top 80%",
            end: "bottom 15%",
            toggleActions: "play reverse play reverse",
          },
        }
      );

      // ── Count-up odometer
      // We only animate the <span data-count> node itself — the suffix
      // sits OUTSIDE that span in JSX, so it's never wiped.
      const statEls = statsRef.current?.querySelectorAll("[data-count]");
      statEls?.forEach((el) => {
        const target = parseInt(el.getAttribute("data-count") || "0", 10);
        const obj = { val: 0 };

        // Set initial display to 0
        el.textContent = "0";

        ScrollTrigger.create({
          trigger: el,
          start: "top 85%",
          once: true,
          onEnter: () => {
            gsap.to(obj, {
              val: target,
              duration: 1.8,
              ease: "power2.out",
              onUpdate: () => {
                el.textContent = Math.round(obj.val).toString();
              },
              onComplete: () => {
                // Snap exact — no floating point drift
                el.textContent = target.toString();
              },
            });
          },
        });
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="px-6 sm:px-12 lg:px-20 py-32 max-w-[1800px] mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-32 items-start">

        {/* Left */}
        <div>
          <h2
            ref={headingRef}
            className="display text-[10vw] md:text-[6vw] leading-none mb-8 opacity-0"
          >
            ABOUT<br />
            <span className="outline-text">ME</span>
          </h2>

          <div ref={textRef} className="space-y-5">
            {[
              "I'm a final-year B.Tech student specializing in AI/ML at UPES Dehradun. I build full-stack products that put AI at the core — not as a feature, but as the foundation.",
              "Currently shipping Monexi.in — a personal finance platform that uses AI for intelligent expense tracking, budget insights, and financial forecasting.",
              "I thrive at the intersection of engineering and product thinking. Fast iterations, clean architecture, and obsessive attention to user experience.",
            ].map((text, i) => (
              <p
                key={i}
                className="about-para text-sm leading-relaxed opacity-0"
                style={{ color: "rgba(250,250,250,0.55)" }}
              >
                {text}
              </p>
            ))}
          </div>
        </div>

        {/* Right: Stats */}
        <div ref={statsRef} className="grid grid-cols-2 gap-8 md:gap-10 pt-4">
          {STATS.map(({ value, suffix, label, prefix }, i) => (
            <div
              key={i}
              className="border border-white/[0.07] p-6 hover:border-[--accent]/30 transition-colors duration-500 group opacity-0"
            >
              <div className="display text-5xl md:text-6xl text-[--paper] group-hover:text-[--accent] transition-colors duration-500">
                {prefix}
                {/*
                  KEY STRUCTURE:
                  <span data-count> only wraps the NUMBER.
                  suffix is a sibling text node OUTSIDE the span.
                  This way count-up can set el.textContent freely
                  without ever wiping the "+" suffix.
                */}
                <span data-count={value}>0</span>
                {suffix}
              </div>
              <p className="text-xs tracking-[0.2em] uppercase mt-2 opacity-40">{label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}