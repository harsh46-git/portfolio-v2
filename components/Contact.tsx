"use client";
import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { ArrowUpRight, Mail, Github, Linkedin } from "lucide-react";

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null);
  const emailRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Heading lines
      gsap.fromTo(
        ".contact-heading",
        { opacity: 0, y: 30 },
        {
          opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
          scrollTrigger: { trigger: ".contact-heading", start: "top 85%", end: "bottom 15%", toggleActions: "play reverse play reverse" },
        }
      );

      // Email link
      gsap.fromTo(
        ".contact-email",
        { opacity: 0 },
        {
          opacity: 1, duration: 0.8, delay: 0.2, ease: "power2.out",
          scrollTrigger: { trigger: ".contact-email", start: "top 88%", end: "bottom 15%", toggleActions: "play reverse play reverse" },
        }
      );

      // Social cards stagger
      gsap.fromTo(
        ".contact-card",
        { opacity: 0, y: 20 },
        {
          opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.1,
          scrollTrigger: { trigger: ".contact-card", start: "top 90%", end: "bottom 15%", toggleActions: "play reverse play reverse" },
        }
      );

      // Magnetic effect on email
      const email = emailRef.current;
      if (!email) return;
      email.addEventListener("mousemove", (e: MouseEvent) => {
        const rect = email.getBoundingClientRect();
        const dx = (e.clientX - (rect.left + rect.width / 2)) * 0.15;
        const dy = (e.clientY - (rect.top + rect.height / 2)) * 0.15;
        gsap.to(email, { x: dx, y: dy, duration: 0.4, ease: "power2.out" });
      });
      email.addEventListener("mouseleave", () => {
        gsap.to(email, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1, 0.5)" });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="py-32 px-6 sm:px-10 border-t border-white/10"
    >
      <div className="max-w-[1800px] mx-auto px-6 sm:px-12 lg:px-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-16">
          <div className="lg:col-span-3">
            <div className="text-xs tracking-[0.3em] uppercase text-white/40">
              (04) — Let's Talk
            </div>
          </div>

          <div className="lg:col-span-9">
            {/* Heading — motion.h2 → plain h2 + GSAP class */}
            <h2 className="contact-heading display text-6xl sm:text-8xl lg:text-9xl leading-[0.9] mb-12">
              Got a problem?
              <br />
              <span className="text-accent">Let's ship.</span>
            </h2>

            {/* Email — motion.a → plain a + magnetic GSAP */}
            <a
              ref={emailRef}
              href="mailto:harshjais466@gmail.com"
              className="contact-email inline-flex items-center gap-4 display text-4xl sm:text-6xl text-paper hover:text-accent transition-colors group"
            >
              harshjais466@gmail.com
              <ArrowUpRight
                size={48}
                className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform"
              />
            </a>

            {/* Social cards — identical markup */}
            <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl">
              <a
                href="https://github.com/harsh46-git"
                target="_blank"
                rel="noreferrer"
                className="contact-card flex items-center gap-3 border border-white/20 p-4 hover:border-accent hover:bg-white/5 transition-all group"
              >
                <Github size={20} className="text-accent" />
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/40">GitHub</div>
                  <div className="text-sm group-hover:text-accent transition">harsh46-git</div>
                </div>
              </a>

              <a
                href="https://www.linkedin.com/in/harsh-kumar-129773270/"
                target="_blank"
                rel="noreferrer"
                className="contact-card flex items-center gap-3 border border-white/20 p-4 hover:border-accent hover:bg-white/5 transition-all group"
              >
                <Linkedin size={20} className="text-accent" />
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/40">LinkedIn</div>
                  <div className="text-sm group-hover:text-accent transition">Harsh-Kumar</div>
                </div>
              </a>

              <a
                href="tel:+916201328696"
                className="contact-card flex items-center gap-3 border border-white/20 p-4 hover:border-accent hover:bg-white/5 transition-all group"
              >
                <Mail size={20} className="text-accent" />
                <div>
                  <div className="text-xs uppercase tracking-widest text-white/40">Phone</div>
                  <div className="text-sm group-hover:text-accent transition">+91 6201328696</div>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}