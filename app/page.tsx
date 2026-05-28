"use client";
import { useEffect } from "react";
import { initScrollAnimations } from "@/lib/scrollAnimations";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Marquee from "@/components/Marquee";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import AskHarsh from "@/components/AskHarsh";
import CursorTrail from "@/components/CursorTrail";
import CinematicIntro from "@/components/CinematicIntro";
import FilmGrain from "@/components/FilmGrain";
import SmoothScroll from "@/components/SmoothScroll";
import CustomCursor from "@/components/CustomCursor";
import ScrollProgress from "@/components/ScrollProgress";



export default function Home() {
  useEffect(() => {
    const t = setTimeout(() => initScrollAnimations(), 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <SmoothScroll>
      <CinematicIntro />
      <ScrollProgress />
      <FilmGrain />
      <CustomCursor />
      <CursorTrail />
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Projects />
        <Experience />
        <Contact />
        <AskHarsh />
      </main>
      <Footer />
    </SmoothScroll>
  );
}