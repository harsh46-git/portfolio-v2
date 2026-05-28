// lib/scrollAnimations.ts
// GTA 6-style cinematic scroll system — call initScrollAnimations() once in a top-level layout
import { gsap, ScrollTrigger } from "@/lib/gsap";

export function initScrollAnimations() {
  if (typeof window === "undefined") return;

  // ─────────────────────────────────────────
  // 1. HERO — HARSH parallax as you scroll away
  //    Text moves slower than scroll = cinematic depth
  // ─────────────────────────────────────────
  gsap.to(".hero-name", {
    yPercent: 30,
    ease: "none",
    scrollTrigger: {
      trigger: "#top",
      start: "top top",
      end: "bottom top",
      scrub: 1,
    },
  });

  // Avatar moves even slower — deeper parallax layer
  gsap.to(".hero-avatar", {
    yPercent: 15,
    ease: "none",
    scrollTrigger: {
      trigger: "#top",
      start: "top top",
      end: "bottom top",
      scrub: 1.5,
    },
  });

  // Hero text fades as you scroll away
  gsap.to([".hero-tags", ".hero-bio"], {
    opacity: 0,
    y: -40,
    ease: "none",
    scrollTrigger: {
      trigger: "#top",
      start: "20% top",
      end: "60% top",
      scrub: 1,
    },
  });

  // ─────────────────────────────────────────
  // 2. MARQUEE — speeds up as user scrolls fast
  //    (velocity-based — feels alive)
  // ─────────────────────────────────────────
  let scrollVelocity = 0;
  let lastScrollY = 0;

  ScrollTrigger.create({
    start: 0,
    end: "max",
    onUpdate: (self) => {
      scrollVelocity = self.getVelocity() / 1000;
      lastScrollY = self.scroll();
    },
  });

  // ─────────────────────────────────────────
  // 3. ABOUT — section slams in with pin
  //    Text lines reveal one by one while pinned
  // ─────────────────────────────────────────
  const aboutLines = gsap.utils.toArray<HTMLElement>(".about-para");
  if (aboutLines.length) {
    gsap.fromTo(
      aboutLines,
      { opacity: 0, y: 60, clipPath: "inset(0 0 100% 0)" },
      {
        opacity: 1, y: 0,
        clipPath: "inset(0 0 0% 0)",
        stagger: 0.2,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: "#about",
          start: "top 70%",
          once: true,
        },
      }
    );
  }

  // About heading — slam from left with skew
  gsap.fromTo(
    "#about h2",
    { x: -100, skewX: -8, opacity: 0 },
    {
      x: 0, skewX: 0, opacity: 1,
      duration: 1.2, ease: "expo.out",
      scrollTrigger: { trigger: "#about", start: "top 75%", once: true },
    }
  );

  // Stat boxes — cascade drop
  gsap.fromTo(
    "#about [data-count]",
    { y: -60, opacity: 0, scale: 1.3 },
    {
      y: 0, opacity: 1, scale: 1,
      duration: 0.7, ease: "back.out(1.5)", stagger: 0.12,
      scrollTrigger: { trigger: "#about", start: "top 65%", once: true },
    }
  );

  // ─────────────────────────────────────────
  // 4. SECTION TRANSITIONS — horizontal line
  //    sweeps across screen between sections
  // ─────────────────────────────────────────
  ["#projects", "#experience", "#contact"].forEach((id) => {
    const el = document.querySelector(id);
    if (!el) return;

    // Section heading slams in from bottom with blur
    const heading = el.querySelector("h2");
    if (heading) {
      gsap.fromTo(
        heading,
        { y: 80, opacity: 0, filter: "blur(12px)" },
        {
          y: 0, opacity: 1, filter: "blur(0px)",
          duration: 1.1, ease: "power4.out",
          scrollTrigger: { trigger: heading, start: "top 85%", once: true },
        }
      );
    }
  });

  // ─────────────────────────────────────────
  // 5. EXPERIENCE — lines draw in left to right
  //    like a cinematic timeline
  // ─────────────────────────────────────────
  gsap.utils.toArray<HTMLElement>(".exp-row").forEach((row, i) => {
    // Border line extends from 0 width
    gsap.fromTo(
      row,
      { borderTopColor: "rgba(255,255,255,0)", x: i % 2 === 0 ? -60 : 60, opacity: 0 },
      {
        borderTopColor: "rgba(255,255,255,0.1)",
        x: 0, opacity: 1,
        duration: 0.9, ease: "power3.out", delay: i * 0.15,
        scrollTrigger: { trigger: row, start: "top 88%", once: true },
      }
    );
  });

  // ─────────────────────────────────────────
  // 6. CONTACT — "LET'S TALK" massive text
  //    scales up from 0 like GTA title card
  // ─────────────────────────────────────────
  gsap.fromTo(
    ".contact-heading",
    { scale: 0.7, opacity: 0, filter: "blur(20px)" },
    {
      scale: 1, opacity: 1, filter: "blur(0px)",
      duration: 1.3, ease: "expo.out",
      scrollTrigger: { trigger: "#contact", start: "top 80%", once: true },
    }
  );

  // ─────────────────────────────────────────
  // 7. GLOBAL — every section fades background
  //    color slightly as it becomes active
  //    (subtle depth cue like GTA loading screens)
  // ─────────────────────────────────────────
  ["#about", "#projects", "#experience", "#contact"].forEach((id) => {
    ScrollTrigger.create({
      trigger: id,
      start: "top 60%",
      end: "bottom 40%",
      onEnter: () => gsap.to("body", { background: "#0a0a0a", duration: 0.5 }),
      onLeave: () => gsap.to("body", { background: "#0a0a0a", duration: 0.5 }),
    });
  });
}