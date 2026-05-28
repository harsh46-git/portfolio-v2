// components/Nav.tsx
"use client";
import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import Magnetic from "@/components/Magnetic";

const links = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Experience", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

export default function Nav() {
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;

    // Entrance animation
    gsap.fromTo(
      nav,
      { y: -80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
    );

    // Hide on scroll down, show on scroll up
    let lastY = 0;
    ScrollTrigger.create({
      start: "top -80",
      onUpdate: (self) => {
        const currentY = self.scroll();
        if (currentY > lastY && currentY > 120) {
          gsap.to(nav, { y: -90, duration: 0.4, ease: "power2.inOut" });
        } else {
          gsap.to(nav, { y: 0, duration: 0.4, ease: "power2.out" });
        }
        lastY = currentY;
      },
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-5"
      style={{ backdropFilter: "blur(12px)", background: "rgba(10,10,10,0.7)" }}
    >
      <span className="text-xs tracking-[0.25em] uppercase text-[--paper] opacity-60">
        Portfolio · 2026
      </span>

      <ul className="hidden md:flex gap-8">
        {links.map((l) => (
          <li key={l.href}>
            <Magnetic strength={0.3} padding={10}>
              <a
                href={l.href}
                onClick={(e) => {
                  e.preventDefault();
                  (window as any).lenis?.scrollTo(l.href, { offset: -80 });
                }}
                className="link-underline text-xs tracking-[0.2em] uppercase text-[--paper] opacity-60 hover:opacity-100 transition-opacity duration-300"
              >
                {l.label}
              </a>
            </Magnetic>
          </li>
        ))}
      </ul>

      <Magnetic strength={0.5} padding={8}>
        <a
          href="#contact"
          onClick={(e) => {
            e.preventDefault();
            (window as any).lenis?.scrollTo("#contact", { offset: -80 });
          }}
          className="text-xs tracking-[0.2em] uppercase border border-[--paper] border-opacity-30 px-5 py-2 hover:border-[--accent] hover:text-[--accent] transition-all duration-300"
        >
          Email Me
        </a>
      </Magnetic>
    </nav>
  );
}