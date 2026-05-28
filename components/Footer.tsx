"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Whole footer fades up on scroll into view
      gsap.fromTo(
        footerRef.current,
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: footerRef.current, start: "top 95%", once: true },
        }
      );

      // Links stagger in
      gsap.fromTo(
        ".footer-link",
        { opacity: 0, y: 10 },
        {
          opacity: 1, y: 0, duration: 0.5, ease: "power2.out", stagger: 0.08,
          scrollTrigger: { trigger: ".footer-link", start: "top 98%", once: true },
        }
      );
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="border-t border-white/10 py-10 px-6 sm:px-10"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>© 2026 Harsh Kumar · Built with Next.js + Tailwind</div>

        <div className="flex gap-6">
          <a
            href="/resume.pdf"
            download
            className="footer-link link-underline"
          >
            Resume
          </a>
          <a
            href="https://github.com/harsh46-git"
            target="_blank"
            rel="noreferrer"
            className="footer-link link-underline"
          >
            GitHub
          </a>
          <a
            href="https://www.monexi.in"
            target="_blank"
            rel="noreferrer"
            className="footer-link link-underline"
          >
            monexi.in ↗
          </a>
        </div>
      </div>
    </footer>
  );
}